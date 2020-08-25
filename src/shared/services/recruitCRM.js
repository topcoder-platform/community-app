import fetch from 'isomorphic-fetch';
import { logger } from 'topcoder-react-lib';
import qs from 'qs';

const PROXY_ENDPOINT = '/api/recruit';

export default class Service {
  baseUrl = PROXY_ENDPOINT;

  /**
   * Get jobs by query
   * @param {*} query The request query
   */
  async getJobs(query) {
    const res = await fetch(`${this.baseUrl}/jobs/search?${qs.stringify(query)}`);
    if (!res.ok) {
      const error = new Error('Failed to get jobs');
      logger.error(error, res);
    }
    return res.json();
  }

  /**
   * Get job by id
   * @param {*} id The request id
   */
  async getJob(id) {
    const res = await fetch(`${this.baseUrl}/jobs/${id}`);
    if (!res.ok) {
      const error = new Error(`Failed to get job ${id}`);
      logger.error(error, res);
    }
    return res.json();
  }

  /**
 * Get all jobs
 * @param {*} query The request query
 */
  async getAllJobs(query) {
    const res = await fetch(`${this.baseUrl}/jobs?${qs.stringify(query)}`);
    if (!res.ok) {
      const error = new Error('Failed to get jobs');
      logger.error(error, res);
    }
    return res.json();
  }
}
