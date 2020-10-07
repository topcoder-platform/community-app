import fetch from 'isomorphic-fetch';
import { logger } from 'topcoder-react-lib';
import qs from 'qs';
import _ from 'lodash';

const PROXY_ENDPOINT = '/api/recruit';

export default class Service {
  baseUrl = PROXY_ENDPOINT;

  /**
   * Get jobs by query
   * @param {object} query The request query
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
 * @param {object} query The request query
 */
  async getAllJobs(query) {
    const res = await fetch(`${this.baseUrl}/jobs?${qs.stringify(query)}`);
    if (!res.ok) {
      const error = new Error('Failed to get jobs');
      logger.error(error, res);
    }
    return res.json();
  }

  /**
   * applyForJob for candidate
   * @param {string} id The job id to apply to
   * @param {object} payload The apply payload
   */
  async applyForJob(id, payload) {
    const { resume } = payload;
    const data = new FormData();
    data.append('resume', resume);
    data.append('form', JSON.stringify(_.omit(payload, 'resume')));
    const res = await fetch(`${this.baseUrl}/jobs/${id}/apply`, {
      method: 'POST',
      body: data,
    });
    if (!res.ok) {
      const error = new Error('Failed to apply for job');
      logger.error(error, res);
    }
    return res.json();
  }
}
