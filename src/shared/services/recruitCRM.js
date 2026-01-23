import fetch from 'isomorphic-fetch';
import { logger } from 'topcoder-react-lib';
import { config } from 'topcoder-react-utils';
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
   * get member applications
   * @param {*} tokenV3
   * @returns
   */
  /* eslint-disable class-methods-use-this */
  async getJobApplications(tokenV3) {
    const res = await fetch(
      `${config.PLATFORM_SITE_URL}/gigs-app/api/my-gigs/myJobApplications?page=1&perPage=1`,
      {
        method: 'GET',
        headers: new Headers({
          Authorization: `Bearer ${tokenV3}`,
        }),
      },
    );
    if (!res.ok) {
      const error = new Error('Failed to get job applications');
      logger.error(error, res);
    }
    return parseInt(res.headers.get('x-total'), 10) || 0;
  }

  /**
   * applyForJob for candidate
   * @param {string} id The job id to apply to
   * @param {object} payload The apply payload
   * @param {string} tokenV3 User token
   */
  async applyForJob(id, payload, tokenV3) {
    const { resume } = payload;
    const data = new FormData();
    data.append('resume', resume);
    data.append('form', JSON.stringify(_.omit(payload, 'resume')));
    const res = await fetch(`${this.baseUrl}/jobs/${id}/apply`, {
      method: 'POST',
      body: data,
      headers: new Headers({
        Authorization: `Bearer ${tokenV3}`,
      }),
      credentials: 'omit',
    });
    if (!res.ok) {
      const error = new Error('Failed to apply for job');
      logger.error(error, res);
    }
    return res.json();
  }

  /**
   * Search for candidate
   * @param {object} email The email to search with
   */
  async searchCandidates(email) {
    const res = await fetch(`${this.baseUrl}/candidates/search?email=${email}`);
    if (!res.ok) {
      const error = new Error('Failed to search for candidates');
      logger.error(error, res);
    }
    return res.json();
  }

  /**
   * Get TAAS jobs
   * @param {object} query The request query
   */
  async getTaasJobs(query) {
    const res = await fetch(`${this.baseUrl}/taasjobs?${qs.stringify(query)}`);
    if (!res.ok) {
      const error = new Error('Failed to get taas jobs');
      logger.error(error, res);
    }
    return res.json();
  }
}
