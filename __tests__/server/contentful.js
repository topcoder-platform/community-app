/* eslint-env jest */

import { createClient as createDeliveryClient } from 'contentful';
import {
  articleVote,
  getService,
} from 'server/services/contentful';

const contentfulManagement = require('contentful-management');

jest.mock('contentful', () => ({
  createClient: jest.fn(() => ({})),
}));

jest.mock('contentful-management', () => ({
  createClient: jest.fn(() => ({
    getSpace: jest.fn(() => Promise.resolve({
      getEnvironment: jest.fn(() => Promise.resolve({
        getEntry: jest.fn(() => Promise.resolve({
          fields: {},
          update: jest.fn(() => Promise.resolve({
            publish: jest.fn(() => Promise.resolve({ published: true })),
          })),
        })),
      })),
    })),
  })),
}));

describe('server/services/contentful HTTPS connections', () => {
  test('shares one keep-alive agent across Delivery, Preview, and Management clients', async () => {
    getService('default', 'master', false);

    const deliveryAgents = createDeliveryClient.mock.calls
      .map(call => call[0].httpsAgent);

    expect(deliveryAgents.length).toBeGreaterThan(1);
    deliveryAgents.forEach((agent) => {
      expect(agent).toBe(deliveryAgents[0]);
      expect(agent.options.keepAlive).toBe(true);
    });

    await articleVote({
      id: 'article-id',
      votes: { downvotes: 1, upvotes: 2 },
    });

    const managementConfig = contentfulManagement.createClient.mock.calls[0][0];
    expect(managementConfig.httpsAgent).toBe(deliveryAgents[0]);
  });
});
