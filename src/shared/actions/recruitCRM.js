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
    `Date Available: ${new Date(payload.availFrom).toDateString()}`,
    `Heard About Gig: ${payload.reffereal}`,
    `Why fit: ${payload.whyFit}`,
    `Availability Per Week: ${payload.timeAvailability.filter(s => s.checked).map(s => s.label).join(',')}`,
    `Able to work during timezone? ${payload.timezoneConfirm.filter(s => s.value).map(s => s.label).join(',')}`,
    `Am I ok to work the duration? ${payload.durationConfirm.filter(s => s.value).map(s => s.label).join(',')}`,
    `Notes: ${payload.notes}`,
  ];
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
      {
        field_id: 14,
        value: perJob.join(','),
      },
    ],
    resume: payload.fileCV,
  };
}

/**
 * Apply for Job done
 */
async function applyForJobDone(job, payload) {
  const ss = new Service();
  try {
    const res = await ss.applyForJob(job.slug, normalizeRecruitPayload(job, payload));

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
