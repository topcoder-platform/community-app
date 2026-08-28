/* eslint-env jest */

import express from 'express';
import request from 'supertest';
import { getService } from 'server/services/contentful';
import routes from 'server/routes/contentful';

jest.mock('server/services/contentful', () => ({
  articleVote: jest.fn(),
  getService: jest.fn(),
}));

function createApp() {
  const app = express();
  app.use(routes);
  app.use((error, req, res, next) => { // eslint-disable-line no-unused-vars
    res.status(502).send(error.message);
  });
  return app;
}

describe('server/routes/contentful legacy asset URLs', () => {
  beforeEach(() => {
    getService.mockReset();
  });

  test('redirects an old image route only to the configured Payload asset origin', async () => {
    const getAsset = jest.fn(() => Promise.resolve({
      fields: { file: { url: '//assets.topcoder-dev.com/media/contentful/image.png' } },
    }));
    getService.mockReturnValue({ getAsset });

    const response = await request(createApp())
      .get('/default/master/images/asset-id/version/image.png');

    expect(response.status).toBe(302);
    expect(response.headers.location)
      .toBe('https://assets.topcoder-dev.com/media/contentful/image.png');
    expect(getService).toHaveBeenCalledWith('default', 'master', false);
    expect(getAsset).toHaveBeenCalledWith('asset-id');
  });

  test('does not redirect when Payload returns a retired provider URL', async () => {
    getService.mockReturnValue({
      getAsset: jest.fn(() => Promise.resolve({
        fields: { file: { url: '//images.ctfassets.net/space/asset/image.png' } },
      })),
    });

    const response = await request(createApp())
      .get('/default/master/assets/asset-id/version/file.pdf');

    expect(response.status).toBe(502);
    expect(response.headers.location).toBeUndefined();
    expect(response.text).toContain('retired provider URL');
  });
});
