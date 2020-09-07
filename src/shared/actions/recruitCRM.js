import { redux } from 'topcoder-react-utils';
import Service from 'services/recruitCRM';

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

export default redux.createActions({
  RECRUIT: {
    GET_JOBS_INIT: getJobsInit,
    GET_JOBS_DONE: getJobsDone,
    GET_JOB_INIT: getJobInit,
    GET_JOB_DONE: getJobDone,
  },
});
