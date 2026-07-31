import config from 'config';
import express from 'express';
import request from 'supertest';

import {
  configuredJwtAuthenticator,
  protectedCorsOptions,
} from 'server/routes/authentication';
import contentfulRoutes, {
  articleVoteLimiter,
} from 'server/routes/contentful';
import recruitRoutes, {
  sensitiveRouteLimiter,
} from 'server/routes/recruitCRM';

jest.mock('tc-core-library-js', () => ({
  middleware: {
    jwtAuthenticator: jest.fn(() => (req, res, next) => next()),
  },
}));

jest.mock('server/services/contentful', () => ({
  ALLOWED_DOMAINS: [],
  ASSETS_DOMAIN: 'assets.example.test',
  IMAGES_DOMAIN: 'images.example.test',
  articleVote: jest.fn(),
  getService: jest.fn(),
  getSpaceId: jest.fn(),
}));

jest.mock('server/services/recruitCRM', () => jest.fn());

/**
 * Gets middleware attached to a specific Express router method.
 * @param {Function} router Express router.
 * @param {String} path Route path.
 * @param {String} method Lowercase HTTP method.
 * @return {Function[]} Attached middleware functions.
 */
function getRouteMiddleware(router, path, method) {
  const layer = router.stack.find(item => item.route
    && item.route.path === path
    && item.route.methods[method]);
  return layer ? layer.route.stack.map(item => item.handle) : [];
}

describe('authenticated route protections', () => {
  test.each([
    ['/jobs/cache/flush', 'get'],
    ['/jobs/:id/apply', 'post'],
    ['/profile', 'get'],
    ['/profile', 'post'],
  ])('rate limits RecruitCRM %s %s before handling it', (path, method) => {
    const routeMiddleware = getRouteMiddleware(recruitRoutes, path, method);
    expect(routeMiddleware).toContain(sensitiveRouteLimiter);
    expect(routeMiddleware).toContain(configuredJwtAuthenticator);
    expect(routeMiddleware.indexOf(sensitiveRouteLimiter))
      .toBeLessThan(routeMiddleware.indexOf(configuredJwtAuthenticator));
  });

  test('rate limits Contentful article voting', () => {
    const routeMiddleware = getRouteMiddleware(
      contentfulRoutes,
      '/:spaceName/:environment/votes',
      'post',
    );
    expect(routeMiddleware).toContain(articleVoteLimiter);
    expect(routeMiddleware).toContain(configuredJwtAuthenticator);
    expect(routeMiddleware.indexOf(articleVoteLimiter))
      .toBeLessThan(routeMiddleware.indexOf(configuredJwtAuthenticator));
  });

  test('uses exact configured origins instead of reflecting any request origin', () => {
    expect(protectedCorsOptions.origin).toContain(new URL(config.URL.BASE).origin);
    expect(protectedCorsOptions.origin).not.toContain('*');
    expect(protectedCorsOptions.origin).not.toContain(true);
  });

  test('does not reflect an untrusted origin on the job application preflight', async () => {
    const app = express();
    app.use(recruitRoutes);
    const trustedOrigin = new URL(config.URL.BASE).origin;

    const trustedResponse = await request(app)
      .options('/jobs/job_slug-123/apply')
      .set('Origin', trustedOrigin)
      .set('Access-Control-Request-Method', 'POST');
    const untrustedResponse = await request(app)
      .options('/jobs/job_slug-123/apply')
      .set('Origin', 'https://attacker.example')
      .set('Access-Control-Request-Method', 'POST');

    expect(trustedResponse.headers['access-control-allow-origin'])
      .toBe(trustedOrigin);
    expect(untrustedResponse.headers['access-control-allow-origin'])
      .toBeUndefined();
  });
});
