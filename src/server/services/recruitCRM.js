/**
 * Server-side functions necessary for effective integration with recruitCRM
 */
import fetch from 'isomorphic-fetch';
import config from 'config';
import qs from 'qs';
import _ from 'lodash';

/**
 * Auxiliary class that handles communication with recruitCRM
 */
export default class RecruitCRMService {
  /**
   * Creates a new service instance.
   * @param {String} baseUrl The base API endpoint.
   */
  constructor(baseUrl = 'https://api.recruitcrm.io') {
    this.private = {
      baseUrl,
      apiKey: config.SECRET.RECRUITCRM_API_KEY,
      authorization: `Bearer ${config.SECRET.RECRUITCRM_API_KEY}`,
    };
  }

  /**
   * Gets jobs endpoint.
   * @return {Promise}
   * @param {Object} the request.
   */
  async getJobs(req, res, next) {
    try {
      const response = await fetch(`${this.private.baseUrl}/v1/jobs/search?${qs.stringify(req.query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': req.headers['content-type'],
          Authorization: this.private.authorization,
        },
      });
      if (response.status === 429) {
        await new Promise(resolve => setTimeout(resolve, 30000)); // wait 30sec
        return this.getJobs(req, res, next);
      }
      if (response.status >= 400) {
        return res.send({
          error: true,
          status: response.status,
          url: `${this.private.baseUrl}/v1/jobs/search?${qs.stringify(req.query)}`,
          key: this.private.authorization,
        });
      }
      const data = await response.json();
      return res.send(data);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Gets job by id endpoint.
   * @return {Promise}
   * @param {Object} the request.
   */
  async getJob(req, res, next) {
    try {
      const response = await fetch(`${this.private.baseUrl}/v1/jobs/${req.params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': req.headers['content-type'],
          Authorization: this.private.authorization,
        },
      });
      if (response.status === 429) {
        await new Promise(resolve => setTimeout(resolve, 30000)); // wait 30sec
        return this.getJob(req, res, next);
      }
      if (response.status >= 400) {
        return res.send({
          error: true,
          status: response.status,
          url: `${this.private.baseUrl}/v1/jobs/${req.params.id}`,
          key: this.private.authorization,
        });
      }
      const data = await response.json();
      return res.send(data);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Gets all jobs endpoint.
   * @return {Promise}
   * @param {Object} the request.
   */
  async getAllJobs(req, res, next) {
    try {
      const response = await fetch(`${this.private.baseUrl}/v1/jobs/search?${qs.stringify(req.query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': req.headers['content-type'],
          Authorization: this.private.authorization,
        },
      });
      if (response.status === 429) {
        await new Promise(resolve => setTimeout(resolve, 30000)); // wait 30sec
        return this.getJobs(req, res, next);
      }
      if (response.status >= 400) {
        return res.send({
          error: true,
          status: response.status,
          url: `${this.private.baseUrl}/v1/jobs/search?${qs.stringify(req.query)}`,
          key: this.private.authorization,
        });
      }
      const data = await response.json();
      if (data.current_page < data.last_page) {
        const pages = _.range(2, data.last_page + 1);
        // eslint-disable-next-line no-restricted-syntax
        for (const page of pages) {
          // eslint-disable-next-line no-await-in-loop
          const pageDataRsp = await fetch(`${this.private.baseUrl}/v1/jobs/search?${qs.stringify(req.query)}&page=${page}`, {
            method: 'GET',
            headers: {
              'Content-Type': req.headers['content-type'],
              Authorization: this.private.authorization,
            },
          });
          // eslint-disable-next-line no-await-in-loop
          const pageData = await pageDataRsp.json();
          data.data = _.flatten(data.data.concat(pageData.data));
        }
      }
      return res.send(data.data);
    } catch (err) {
      return next(err);
    }
  }
}
