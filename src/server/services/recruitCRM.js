/**
 * Server-side functions necessary for effective integration with recruitCRM
 */
import fetch from 'isomorphic-fetch';
import config from 'config';
import qs from 'qs';
import _ from 'lodash';
import { logger, services } from 'topcoder-react-lib';
import Joi from 'joi';
import xss from 'xss';
import { sendEmailDirect } from './sendGrid';
// import GSheetService from './gSheet';


const { api } = services;

const FormData = require('form-data');
const NodeCache = require('node-cache');

// gigs list caching
const CACHE_KEY = 'jobs';
const gigsCache = new NodeCache({ stdTTL: config.GIGS_LISTING_CACHE_TIME, checkperiod: 10 });

const JOB_FIELDS_RESPONSE = [
  'id',
  'slug',
  'country',
  'locality',
  'city',
  'name',
  'custom_fields',
  'enable_job_application_form',
  'created_on',
  'updated_on',
  'min_annual_salary',
  'salary_type',
  'max_annual_salary',
  'job_description_text',
  'job_status',
];
const CANDIDATE_FIELDS_RESPONSE = [
  'id',
  'slug',
  'first_name',
  'last_name',
  'email',
  'contact_number',
  'skill',
  'resume',
  'locality',
  'salary_expectation',
  'custom_fields',
];
const OMIT_CUSTOM_FIELDS = [
  'Candidates Link',
  'Account Executive',
  'Wipro Centralization SPOC',
];

/**
 * Send email to Kiril/Nick for debuging gig application errors
 * @param {Object} error the error
 */
function notifyKirilAndNick(error) {
  logger.error(error);
  sendEmailDirect({
    personalizations: [
      {
        to: [{ email: 'kiril.kartunov@gmail.com' }, { email: 'ncastillo@topcoder.com' }],
        subject: 'Gig application error alert',
      },
    ],
    from: { email: 'noreply@topcoder.com' },
    content: [{
      type: 'text/plain', value: `The error occured as JSON string:\n\n ${JSON.stringify(error)}`,
    }],
  });
}

/**
 * Sanitize Job before return
 * @param {Object} job data from recuitcrm api
 */
function sanitizeJob(job) {
  const sJob = _.pick(job, JOB_FIELDS_RESPONSE);
  sJob.custom_fields = _.filter(
    sJob.custom_fields, f => !_.includes(OMIT_CUSTOM_FIELDS, f.field_name),
  );
  return sJob;
}

const updateProfileSchema = Joi.object().keys({
  phone: Joi.string().required(),
  availability: Joi.boolean().required(),
  city: Joi.string().required(),
  countryName: Joi.string().required(),
}).required();

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

  // eslint-disable-next-line class-methods-use-this
  getJobsCacheStats(req, res) {
    return res.send(gigsCache.getStats());
  }

  // eslint-disable-next-line class-methods-use-this
  getJobsCacheFlush(req, res) {
    gigsCache.flushAll();
    return res.send(gigsCache.getStats());
  }

  /**
   * getJobsFromTaas endpoint.
   * @return {Promise}
   * @param {Object} the request.
   */
  // eslint-disable-next-line class-methods-use-this
  async getJobsFromTaas(req, res, next) {
    try {
      const m2mToken = await api.getTcM2mToken();
      const v5api = api.getApiV5(m2mToken);
      const jobs = await v5api.get(`/jobs?${qs.stringify(req.query)}`);
      return res.send({
        jobs: await jobs.json(),
      });
    } catch (err) {
      return next(err);
    }
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
        const error = {
          error: true,
          status: response.status,
          url: `${this.private.baseUrl}/v1/jobs/search?${qs.stringify(req.query)}`,
          errObj: await response.json(),
        };
        logger.error(error);
        return res.send(error);
      }
      const data = await response.json();

      data.data = _.map(data.data, j => sanitizeJob(j));

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
      const sanitizedId = xss(req.params.id);

      if (!/^[a-zA-Z0-9-_]{8,23}$/.test(sanitizedId)) {
        return res.status(400).json({ error: 'Invalid job ID format.' });
      }
      const response = await fetch(`${this.private.baseUrl}/v1/jobs/${sanitizedId}`, {
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
        const error = {
          error: true,
          status: response.status,
          url: `${this.private.baseUrl}/v1/jobs/${sanitizedId}`,
          errObj: await response.json(),
        };
        logger.error(error);
        return res.send(error);
      }
      const data = await response.json();

      // If job or form not open return just job status
      if ((data.job_status && data.job_status.id !== 1)
        || data.enable_job_application_form !== 1) {
        return res.send({
          job_status: data.job_status,
          enable_job_application_form: data.enable_job_application_form,
        });
      }

      return res.send(sanitizeJob(data));
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Gets all jobs method.
   * @return {Promise}
   * @param {Object} query the request query.
   */
  async getAll(query) {
    try {
      const response = await fetch(`${this.private.baseUrl}/v1/jobs/search?${qs.stringify(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.private.authorization,
        },
      });
      if (response.status === 429) {
        await new Promise(resolve => setTimeout(resolve, 30000)); // wait 30sec
        return this.getAll(query);
      }
      if (response.status >= 400) {
        const error = {
          error: true,
          status: response.status,
          url: `${this.private.baseUrl}/v1/jobs/search?${qs.stringify(query)}`,
          errObj: await response.json(),
        };
        return error;
      }
      const data = await response.json();
      if (data.current_page < data.last_page) {
        const pages = _.range(2, data.last_page + 1);
        return Promise.all(
          pages.map(page => fetch(`${this.private.baseUrl}/v1/jobs/search?${qs.stringify(query)}&page=${page}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
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

            // Filter by Job Application active
            data.data = _.filter(data.data, job => job.enable_job_application_form === 1);

            const toSend = _.map(data.data, j => sanitizeJob(j));
            return toSend;
          });
      }

      // Filter by Job Application active
      data.data = _.filter(data.data, job => job.enable_job_application_form === 1);

      const toSend = _.map(data.data, j => sanitizeJob(j));
      return toSend;
    } catch (err) {
      return err;
    }
  }

  /**
   * Gets all jobs endpoint.
   * @return {Promise}
   * @param {Object} the request.
   */
  async getAllJobs(req, res, next) {
    if (gigsCache.has(CACHE_KEY)) {
      return res.send(gigsCache.get(CACHE_KEY));
    }
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
        const error = {
          error: true,
          status: response.status,
          url: `${this.private.baseUrl}/v1/jobs/search?${qs.stringify(req.query)}`,
          errObj: await response.json(),
        };
        logger.error(error);
        return res.send(error);
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

            // Filter by Job Application active
            data.data = _.filter(data.data, job => job.enable_job_application_form === 1);

            const toSend = _.map(data.data, j => sanitizeJob(j));
            gigsCache.set(CACHE_KEY, toSend);
            return res.send(toSend);
          })
          .catch(e => res.send({
            error: e,
          }));
      }

      // Filter by Job Application active
      data.data = _.filter(data.data, job => job.enable_job_application_form === 1);

      const toSend = _.map(data.data, j => sanitizeJob(j));
      gigsCache.set(CACHE_KEY, toSend);
      return res.send(toSend);
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
        const error = {
          error: true,
          status: response.status,
          url: `${this.private.baseUrl}/v1/candidates/search?${qs.stringify(req.query)}`,
          errObj: await response.json(),
        };
        logger.error(error);
        return res.send(error);
      }
      const data = await response.json();
      data.data = _.map(data.data, j => _.pick(j, CANDIDATE_FIELDS_RESPONSE));
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
    if (file) {
      fileData.append('resume', file.buffer, file.originalname);
    }
    let candidateSlug;
    let isNewCandidate = true;
    const isReferred = false;
    let growRes;
    try {
      // Check if candidate exists in the system?
      const candidateResponse = await fetch(`${this.private.baseUrl}/v1/candidates/search?email=${form.email}`, {
        method: 'GET',
        headers: {
          'Content-Type': req.headers['content-type'],
          Authorization: this.private.authorization,
        },
      });
      if (candidateResponse.status >= 300) {
        const error = {
          error: true,
          status: candidateResponse.status,
          url: `${this.private.baseUrl}/v1/candidates/search?email=${form.email}`,
          errorObj: await candidateResponse.json(),
        };
        notifyKirilAndNick(error);
        return res.send(error);
      }
      let candidateData = await candidateResponse.json();
      if (candidateData.data) {
        // Candidate exists in recruitCRM
        // We will update profile fields, otherwise we create new candidate below
        // Check if candidate is placed in gig currently
        isNewCandidate = false;
        const candStatusIndex = _.findIndex(
          candidateData.data[0].custom_fields, { field_id: 12 },
        );
        if (candStatusIndex !== -1 && candidateData.data[0].custom_fields[candStatusIndex].value === 'Placed') {
          // reject application
          return res.send({
            error: true,
            errorObj: {
              notAllowed: true,
              message: 'Apologies, you are not allowed to apply to gigs if you are already placed on a gig.',
            },
          });
        }
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
      if (workCandidateResponse.status >= 300) {
        const error = {
          error: true,
          status: workCandidateResponse.status,
          url: `${this.private.baseUrl}/v1/candidates${candidateSlug ? `/${candidateSlug}` : ''}`,
          form,
          errorObj: await workCandidateResponse.json(),
        };
        notifyKirilAndNick(error);
        return res.send(error);
      }
      candidateData = await workCandidateResponse.json();
      // Attach resume to candidate if uploaded
      if (file) {
        const formHeaders = fileData.getHeaders();
        const fileCandidateResponse = await fetch(`${this.private.baseUrl}/v1/candidates/${candidateData.slug}`, {
          method: 'POST',
          headers: {
            Authorization: this.private.authorization,
            ...formHeaders,
          },
          body: fileData,
        });
        if (fileCandidateResponse.status >= 300) {
          const error = {
            error: true,
            status: fileCandidateResponse.status,
            url: `${this.private.baseUrl}/v1/candidates/${candidateData.slug}`,
            form,
            fileData,
            file,
            formHeaders,
            errorObj: await fileCandidateResponse.json(),
          };
          notifyKirilAndNick(error);
          return res.send(error);
        }
        candidateData = await fileCandidateResponse.json();
      }
      // Candidate ready to apply for job
      const applyResponse = await fetch(`${this.private.baseUrl}/v1/candidates/${candidateData.slug}/assign?job_slug=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': req.headers['content-type'],
          Authorization: this.private.authorization,
        },
      });
      if (applyResponse.status >= 300) {
        const errObj = await applyResponse.json();
        if (errObj.errorCode === 422 && errObj.errorMessage === 'Candidate is already assigned to this job') {
          return res.send({
            success: true,
          });
        }
        const error = {
          error: true,
          status: applyResponse.status,
          url: `${this.private.baseUrl}/v1/candidates/${candidateData.slug}/assign?job_slug=${id}`,
          form,
          candidateData,
          errorObj: errObj,
        };
        notifyKirilAndNick(error);
        return res.send(error);
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
      if (hireStageResponse.status >= 300) {
        const error = {
          error: true,
          status: hireStageResponse.status,
          url: `$${this.private.baseUrl}/v1/candidates/${candidateData.slug}/hiring-stages/${id}`,
          form,
          errorObj: await hireStageResponse.json(),
        };
        notifyKirilAndNick(error);
        return res.send(error);
      }
      // For new candidates that apply via referral link
      // aka triggered referral state step 1 - notify and etc. housekeeping tasks
      if (isNewCandidate && isReferred && !growRes.error) {
        // update the tracking sheet
        // enable that code when issue with service account key structure is resolved
        // const gs = new GSheetService();
        // await gs.addToSheet(config.GIG_REFERRALS_SHEET, [[
        //   `${form.first_name} ${form.last_name}`,
        //   form.email,
        //   `https://app.recruitcrm.io/candidate/${candidateData.slug}`,
        //   `https://topcoder.com/members/${form.custom_fields[tcHandle].value}`,
        //   `${growRes.referrer.firstName} ${growRes.referrer.lastName}`,
        //   growRes.referrer.email,
        //   `https://topcoder.com/members/${growRes.referrer.metadata.tcHandle}`,
        //   `https://app.recruitcrm.io/job/${id}`,
        // ]]);
        // Notify the person who referred
        sendEmailDirect({
          personalizations: [
            {
              to: [{ email: growRes.referrer.email }],
              subject: 'Thanks for your Topcoder referral!',
            },
          ],
          from: { email: 'noreply@topcoder.com', name: 'The Topcoder Community Team' },
          content: [{
            type: 'text/html', value: `<p>Hello ${growRes.referrer.metadata.tcHandle},<p/><p>You just made our day! Sharing a Topcoder Gig Work opportunity is the BEST compliment you can give us. So pat yourself on the back, give yourself a hi-five, or just stand up and dance like no one is watching. You deserve it!</p><p>Did you know many of our Topcoder members consider earning through Topcoder to be life changing? There must be <a href="https://www.youtube.com/watch?v=8J7yTze4Xbs" target="_blank">something in the air</a>. You have just taken the first step into helping someone you know change their life for the better.</p><p>Because of that, we are excited to reward you. $500 is earned for every referral you send us that gets the gig. <a href="https://www.topcoder.com/community/gig-referral">Learn more here</a>.</p><p>Thank you for sharing Topcoder Gigs and hope to see you around here again soon!</p><p>- The Topcoder Community Team</p>`,
          }],
        });
      }
      // respond to API call
      const data = await applyResponse.json();
      return res.send(data);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Get user profile endpoint.
   * @return {Promise}
   * @param {Object} the request.
   */
  async getProfile(req, res, next) {
    try {
      // get candidate by email
      const candidate = await this.getCandidateByEmail(req.authUser.email);
      // return error if getCandidateByEmail operation failed
      if (candidate.error) {
        const error = candidate;
        logger.error(error);
        const responseNoProfileMapping = {
          hasProfile: false,
        };
        return res.send(responseNoProfileMapping);
      }
      // apply desired response format
      const responseMapping = {
        hasProfile: true,
        phone: candidate.contact_number,
        salaryExpectation: candidate.salary_expectation,
        skill: candidate.skill,
        resume: candidate.resume,
        availability: _.isNil(candidate.available_from) ? true
          : new Date(candidate.available_from) <= new Date(),
      };
      return res.send(responseMapping);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Update user profile endpoint.
   * @return {Promise}
   * @param {Object} the request.
   */
  async updateProfile(req, res, next) {
    const { body, file } = req;
    // validate provided data
    const validationResult = updateProfileSchema.validate(body);
    if (validationResult.error) {
      return res.status(400).send({ message: validationResult.error.message });
    }
    const fileData = new FormData();
    if (file) {
      fileData.append('resume', file.buffer, file.originalname);
    }
    try {
      // get candidate by email
      const candidate = await this.getCandidateByEmail(req.authUser.email);
      // return error if getCandidateByEmail operation failed
      if (candidate.error) {
        const error = candidate;
        logger.error(error);
        return res.status(error.status).send(error);
      }
      const candidateSlug = candidate.slug;
      const form = {
        city: body.city,
        locality: body.countryName,
        contact_number: body.phone,
        available_from: body.availability === 'true' ? new Date().toISOString() : new Date('2100-01-01').toISOString(),
      };
      // update candidate profile
      const response = await fetch(`${this.private.baseUrl}/v1/candidates/${candidateSlug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.private.authorization,
        },
        body: JSON.stringify(form),
      });
      if (response.status >= 300) {
        const error = {
          error: true,
          status: response.status,
          url: `${this.private.baseUrl}/v1/candidates${candidateSlug}`,
          form,
          errorObj: await response.json(),
        };
        logger.error(error);
        return res.status(error.status).send(error);
      }
      // Attach resume to candidate if uploaded
      if (file) {
        const formHeaders = fileData.getHeaders();
        const fileResponse = await fetch(`${this.private.baseUrl}/v1/candidates/${candidateSlug}`, {
          method: 'POST',
          headers: {
            Authorization: this.private.authorization,
            ...formHeaders,
          },
          body: fileData,
        });
        if (fileResponse.status >= 300) {
          const error = {
            error: true,
            status: fileResponse.status,
            url: `${this.private.baseUrl}/v1/candidates/${candidateSlug}`,
            file,
            formHeaders,
            errorObj: await fileResponse.json(),
          };
          logger.error(error);
          return res.status(error.status).send(error);
        }
      }
      return res.status(204).end();
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Get candidate by email
   * @return {object} result of the search operation
   * @param {string} email email address of the user.
   */
  async getCandidateByEmail(email) {
    const query = {
      email,
    };
    const url = `${this.private.baseUrl}/v1/candidates/search?${qs.stringify(query)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: this.private.authorization,
      },
    });
    if (response.status === 429) {
      await new Promise(resolve => setTimeout(resolve, 30000)); // wait 30sec
      return this.getCandidateByEmail(email);
    }
    if (response.status >= 300) {
      const error = {
        error: true,
        status: response.status,
        url,
        errObj: await response.json(),
      };
      return error;
    }
    const data = await response.json();
    // return error object if candidate with provided email not found
    if ((_.isArray(data) && data.length === 0) || data.data.length === 0) {
      const error = {
        error: true,
        status: 404,
        url,
        errObj: {
          message: `No candidate was found with email: ${email}`,
        },
      };
      return error;
    }
    // return first candidate
    return data.data[0];
  }
}

// Self update cache on expire to keep it fresh
gigsCache.on('expired', async (key) => {
  if (key === CACHE_KEY) {
    const ss = new RecruitCRMService();
    const gigs = await ss.getAll({
      job_status: 1,
    });
    if (!gigs.error) {
      gigsCache.set(CACHE_KEY, gigs);
    }
  }
});
