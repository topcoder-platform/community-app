import { redux } from 'topcoder-react-utils';
import Service from 'services/recruitCRM';
import _ from 'lodash';

/**
 * Jobs page fetch init
 */
function getJobsInit() {
  return {};
}

/**
 * Jobs page fetch done
 */
async function getJobsDone(query) {
  const ss = new Service();
  const res = await ss.getAllJobs(query);

  return {
    data: res,
  };
}

/**
 * Job fetch init
 */
function getJobInit(id) {
  return { id };
}

/**
 * Job fetch done
 */
async function getJobDone(id) {
  const ss = new Service();
  const res = await ss.getJob(id);

  return {
    id,
    data: res,
  };
}

/**
 * Apply for Job init
 */
function applyForJobInit(id, payload) {
  return { id, payload };
}

/**
 * Helper utitlity
 * @param {object} payload The apply form payload
 */
function normalizeRecruitPayload(payload) {
  return {
    last_name: payload.lname,
    first_name: payload.fname,
    email: payload.email,
    contact_number: payload.phone,
    city: payload.city,
    locality: _.find(payload.country, { selected: true }).label,
    available_from: payload.availFrom,
    salary_expectation: payload.payExpectation,
    skill: payload.skills.filter(s => s.selected).map(s => s.label).join(','),
    custom_fields: [
      {
        field_id: 13,
        value: payload.reffereal || '',
      },
      {
        field_id: 1,
        value: payload.tcProfileLink || (payload.handle ? `topcoder.com/members/${payload.handle}` : ''),
      },
      {
        field_id: 2,
        value: payload.handle || '',
      },
      {
        field_id: 3,
        value: payload.whyFit || '',
      },
    ],
    resume: payload.fileCV,
  };
}

/**
 * Apply for Job done
 */
async function applyForJobDone(id, payload) {
  const ss = new Service();
  const res = await ss.applyForJob(id, normalizeRecruitPayload(payload));

  return {
    id,
    data: res,
  };
}

export default redux.createActions({
  RECRUIT: {
    GET_JOBS_INIT: getJobsInit,
    GET_JOBS_DONE: getJobsDone,
    GET_JOB_INIT: getJobInit,
    GET_JOB_DONE: getJobDone,
    APPLY_FOR_JOB_INIT: applyForJobInit,
    APPLY_FOR_JOB_DONE: applyForJobDone,
  },
});
