/**
 * Service that fetches timeline
 */
import fetch from 'isomorphic-fetch';
import { logger } from 'topcoder-react-lib';
import { config } from 'topcoder-react-utils';

export default class Service {
  baseUrl = config.URL.TIMELNE_EVENT_API;

  /**
   * Get timelne events
   */
  async getTimelineEvents() {
    const res = await fetch(`${this.baseUrl}/timeline/events`);
    if (!res.ok) {
      const error = new Error('Failed to get timeline events');
      logger.error(error, res);
      return Promise.resolve([]);
    }
    return res.json();
  }
}
