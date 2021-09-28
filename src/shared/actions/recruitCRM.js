import { redux } from 'topcoder-react-utils';
import Service from 'services/recruitCRM';
import _ from 'lodash';
import { getCustomField } from 'utils/gigs';

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

function getJobApplicationsInit() {
  return {};
}

async function getJobApplicationsDone(tokenV3) {
  const ss = new Service();
  const res = await ss.getJobApplications(tokenV3);
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
function applyForJobInit(job, payload) {
  return { id: job.slug, payload };
}

/**
 * Helper utitlity
 * @param {object} joib The job object
 * @param {object} payload The apply form payload
 */
function normalizeRecruitPayload(job, payload) {
  const perJob = [
    `${job.name} ->`,
    `Pay Expectation: ${payload.payExpectation}`,
    `Able to work during timezone? ${payload.timezoneConfirm.filter(s => s.value).map(() => getCustomField(job.custom_fields, 'Timezone')).join(',')}`,
    `Am I ok to work the duration? ${payload.durationConfirm.filter(s => s.value).map(() => getCustomField(job.custom_fields, 'Duration')).join(',')}`,
  ];
  const referral = _.find(payload.reffereal, { selected: true });
  const normalized = {
    last_name: payload.lname,
    first_name: payload.fname,
    email: payload.email,
    contact_number: payload.phone,
    city: payload.city,
    locality: _.find(payload.country, { selected: true }).label,
    salary_expectation: _.trim(payload.payExpectation),
    skill: payload.skills.filter(s => s.selected).map(s => s.label).join(','),
    custom_fields: [
      {
        field_id: 1,
        value: payload.tcProfileLink || (payload.handle ? `https://topcoder.com/members/${payload.handle}` : ''),
      },
      {
        field_id: 2,
        value: payload.handle || '',
      },
      {
        field_id: 14,
        value: perJob.join(','),
      },
    ],
  };
  if (referral) {
    normalized.custom_fields.push({
      field_id: 13,
      value: referral.label,
    });
  }
  if (payload.fileCV) {
    normalized.resume = payload.fileCV;
  }

  return normalized;
}

/**
 * Apply for Job done
 */
async function applyForJobDone(job, payload, tokenV3) {
  const ss = new Service();
  try {
    const res = await ss.applyForJob(job.slug, normalizeRecruitPayload(job, payload), tokenV3);

    return {
      id: job.slug,
      data: res,
    };
  } catch (error) {
    return {
      id: job.slug,
      data: {
        error: true,
        errorObj: error,
      },
    };
  }
}

/**
 * Search for cnadidate in recruit
 */
function searchCandidatesInit(email) {
  return { email };
}

/**
 * Search for cnadidate in recruit and get profile if available
 * @param {string} email the email to search
 */
async function searchCandidatesDone(email) {
  const ss = new Service();
  try {
    const res = await ss.searchCandidates(email);

    return {
      email,
      data: res,
    };
  } catch (error) {
    return {
      email,
      data: {
        error: true,
        errorObj: error,
      },
    };
  }
}

/**
 * Gigs fetch init
 */
function getGigsInit() {
  return {};
}

/**
 * Gigs fetch done
 */
async function getGigsDone(query) {
  const ss = new Service();
  const res = await ss.getTaasJobs(query);

  return {
    data: res.jobs,
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
    SEARCH_CANDIDATES_INIT: searchCandidatesInit,
    SEARCH_CANDIDATES_DONE: searchCandidatesDone,
    GET_JOB_APPLICATIONS_INIT: getJobApplicationsInit,
    GET_JOB_APPLICATIONS_DONE: getJobApplicationsDone,
    GET_GIGS_INIT: getGigsInit,
    GET_GIGS_DONE: getGigsDone,
  },
});
