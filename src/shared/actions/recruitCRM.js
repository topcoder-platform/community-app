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
  const res = await ss.getJobs(query);

  return {
    data: res,
  };
}

export default redux.createActions({
  RECRUIT: {
    GET_JOBS_INIT: getJobsInit,
    GET_JOBS_DONE: getJobsDone,
  },
});
