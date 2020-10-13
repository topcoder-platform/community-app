/**
 * Server-side functions necessary for effective integration with recruitCRM
 */
import fetch from 'isomorphic-fetch';
import config from 'config';
import qs from 'qs';
import _ from 'lodash';

const FormData = require('form-data');

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
        });
      }
      const data = await response.json();
      if (data.current_page < data.last_page) {
        const pages = _.range(2, data.last_page + 1);
        return Promise.all(
          pages.map(page => fetch(`${this.private.baseUrl}/v1/jobs/search?${qs.stringify(req.query)}&page=${page}`, {
            method: 'GET',
            headers: {
              'Content-Type': req.headers['content-type'],
              Authorization: this.private.authorization,
            },
          })),
        )
          .then(async (allPages) => {
            // eslint-disable-next-line no-restricted-syntax
            for (const pageDataRsp of allPages) {
              // eslint-disable-next-line no-await-in-loop
              const pageData = await pageDataRsp.json();
              data.data = _.flatten(data.data.concat(pageData.data));
            }
            return res.send(data.data);
          })
          .catch(e => res.send({
            error: e,
          }));
      }
      return res.send(data.data);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Search for candidate by email endpoint.
   * @return {Promise}
   * @param {Object} the request.
   */
  async searchCandidates(req, res, next) {
    try {
      const response = await fetch(`${this.private.baseUrl}/v1/candidates/search?${qs.stringify(req.query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': req.headers['content-type'],
          Authorization: this.private.authorization,
        },
      });
      if (response.status === 429) {
        await new Promise(resolve => setTimeout(resolve, 30000)); // wait 30sec
        return this.searchCandidates(req, res, next);
      }
      if (response.status >= 400) {
        return res.send({
          error: true,
          status: response.status,
          url: `${this.private.baseUrl}/v1/candidates/search?${qs.stringify(req.query)}`,
        });
      }
      const data = await response.json();
      return res.send(data);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Apply for candidate for job endpoint.
   * @return {Promise}
   * @param {Object} the request.
   */
  async applyForJob(req, res, next) {
    const { id } = req.params;
    const { body, file } = req;
    const form = JSON.parse(body.form);
    const fileData = new FormData();
    fileData.append('resume', file.buffer, file.originalname);
    let candidateSlug;
    try {
      // Check if candidate exsits in the system?
      const candidateResponse = await fetch(`${this.private.baseUrl}/v1/candidates/search?email=${form.email}`, {
        method: 'GET',
        headers: {
          'Content-Type': req.headers['content-type'],
          Authorization: this.private.authorization,
        },
      });
      if (candidateResponse.status >= 400) {
        return res.send({
          error: true,
          status: candidateResponse.status,
          url: `${this.private.baseUrl}/v1/candidates/search?email=${form.email}`,
          errObj: await candidateResponse.json(),
        });
      }
      let candidateData = await candidateResponse.json();
      if (candidateData.data) {
        // Candidate exists we will update profile fields
        // otherwise we create it
        candidateSlug = candidateData.data[0].slug;
        const fieldIndexProfile = _.findIndex(
          candidateData.data[0].custom_fields, { field_id: 14 },
        );
        const fieldIndexForm = _.findIndex(form.custom_fields, { field_id: 14 });
        if (fieldIndexProfile !== -1 && fieldIndexForm !== -1) {
          form.custom_fields[fieldIndexForm].value += `;${candidateData.data[0].custom_fields[fieldIndexProfile].value}`;
          if (form.custom_fields[fieldIndexForm].value.length > 2000) {
            form.custom_fields[fieldIndexForm].value = form.custom_fields[
              fieldIndexForm].value.slice(0, 2000);
          }
        }
      }
      // Create/update candidate profile
      const workCandidateResponse = await fetch(`${this.private.baseUrl}/v1/candidates${candidateSlug ? `/${candidateSlug}` : ''}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.private.authorization,
        },
        body: JSON.stringify(form),
      });
      if (workCandidateResponse.status >= 400) {
        return res.send({
          error: true,
          status: workCandidateResponse.status,
          url: `${this.private.baseUrl}/v1/candidates${candidateSlug ? `/${candidateSlug}` : ''}`,
          form,
          errObj: await workCandidateResponse.json(),
        });
      }
      candidateData = await workCandidateResponse.json();
      // Attach resume to candidate
      const formHeaders = fileData.getHeaders();
      const fileCandidateResponse = await fetch(`${this.private.baseUrl}/v1/candidates/${candidateData.slug}`, {
        method: 'POST',
        headers: {
          Authorization: this.private.authorization,
          ...formHeaders,
        },
        body: fileData,
      });
      if (fileCandidateResponse.status >= 400) {
        return res.send({
          error: true,
          status: fileCandidateResponse.status,
          url: `${this.private.baseUrl}/v1/candidates/${candidateData.slug}`,
          form,
          fileData,
          file,
          formHeaders,
          errObj: await fileCandidateResponse.json(),
        });
      }
      candidateData = await fileCandidateResponse.json();
      // Candidate ready to apply for job
      const applyResponse = await fetch(`${this.private.baseUrl}/v1/candidates/${candidateData.slug}/assign?job_slug=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': req.headers['content-type'],
          Authorization: this.private.authorization,
        },
      });
      if (applyResponse.status >= 400) {
        const errObj = await applyResponse.json();
        if (errObj.errorCode === 422 && errObj.errorMessage === 'Candidate is already assigned to this job') {
          return res.send({
            success: true,
          });
        }
        return res.send({
          error: true,
          status: applyResponse.status,
          url: `${this.private.baseUrl}/v1/candidates/${candidateData.slug}/assign?job_slug=${id}`,
          form,
          candidateData,
          errObj,
        });
      }
      // Set hired-stage
      const hireStageResponse = await fetch(`${this.private.baseUrl}/v1/candidates/${candidateData.slug}/hiring-stages/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.private.authorization,
        },
        body: JSON.stringify({
          candidate_slug: candidateData.slug,
          job_slug: id,
          status_id: '10',
        }),
      });
      if (hireStageResponse.status >= 400) {
        return res.send({
          error: true,
          status: hireStageResponse.status,
          url: `$${this.private.baseUrl}/v1/candidates/${candidateData.slug}/hiring-stages/${id}`,
          form,
          errObj: await hireStageResponse.json(),
        });
      }
      // respond to API call
      const data = await applyResponse.json();
      return res.send(data);
    } catch (err) {
      return next(err);
    }
  }
}
