import fetch from 'isomorphic-fetch';
import { logger } from 'topcoder-react-lib';
import qs from 'qs';

const PROXY_ENDPOINT = '/api/blog';

export default class Service {
  baseUrl = PROXY_ENDPOINT;

  /**
   * Get Blogs
   */
  async getBlogs(limit, category) {
    const query = {
      limit,
      category,
    };
    const res = await fetch(`${this.baseUrl}/?${qs.stringify(query)}`);
    if (!res.ok) {
      const error = new Error('Failed to get blog');
      logger.error(error, res);
    }
    return res.json();
  }
}
