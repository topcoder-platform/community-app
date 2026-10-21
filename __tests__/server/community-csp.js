import config from 'config';
import express from 'express';
import request from 'supertest';
import { server as serverFactory } from 'topcoder-react-utils';

jest.mock('dd-trace', () => ({ init: jest.fn() }));
jest.mock('shared', () => ({}));
jest.mock('topcoder-react-lib', () => ({}));
jest.mock('topcoder-react-utils', () => ({ server: jest.fn() }));
jest.mock('utils/SSR', () => ({}));
jest.mock('reducers', () => ({}));
jest.mock('services/money', () => ({}));
jest.mock('utils/xml2json', () => ({}));
jest.mock('server/routes/cdn', () => jest.fn());
jest.mock('server/routes/recruitCRM', () => jest.fn());
jest.mock('server/routes/mmLeaderboard', () => jest.fn());
jest.mock('server/routes/feeds', () => jest.fn());
jest.mock('server/tc-communities', () => jest.fn());
jest.mock('../../webpack.config', () => jest.fn());

describe('community Content-Security-Policy', () => {
  let app;

  beforeAll(async () => {
    require('server'); // eslint-disable-line global-require
    app = express();
    await serverFactory.mock.calls[0][1].onExpressJsSetup(app);
    app.get('*', (req, res) => res.send('Community page'));
  });

  test.each([
    ['veterans.topcoder.com', '/'],
    ['veterans.topcoder.com', '/learn'],
    ['community-app.topcoder-dev.com', '/__community__/veterans'],
    ['community-app.topcoder-dev.com', '/__community__/veterans/learn'],
    ['tco22.topcoder.com', '/'],
    ['community-app.topcoder-dev.com', '/__community__/tco22'],
  ])('allows CDN assets and their static-asset redirects on %s%s', async (host, url) => {
    const response = await request(app).get(url).set('Host', host);
    const directives = response.headers['content-security-policy'].split(';')
      .map(directive => directive.trim().split(/\s+/));

    ['script-src', 'style-src', 'font-src', 'img-src'].forEach((name) => {
      const sources = directives.find(directive => directive[0] === name).slice(1);
      expect(sources).toContain("'self'");
      expect(sources).toContain(config.CDN.PUBLIC);
      expect(sources).toContain(`${config.URL.COMMUNITY_APP}/api/cdn/public/static-assets/`);
      expect(sources).not.toContain('*');
      expect(sources).not.toContain(config.URL.COMMUNITY_APP);
    });

    expect(directives).toContainEqual(['object-src', "'none'"]);
    expect(directives).toContainEqual(['base-uri', "'self'"]);
  });

  test('does not add the community policy to unrelated pages', async () => {
    const response = await request(app).get('/challenges').set('Host', 'www.topcoder.com');
    expect(response.headers['content-security-policy']).toBeUndefined();
  });

  test('preserves the CMS example frame policy', async () => {
    const response = await request(app).get('/examples').set('Host', 'www.topcoder.com');
    expect(response.headers['content-security-policy'])
      .toBe(`frame-ancestors 'self' ${config.URL.CMS_APP}`);
  });
});
