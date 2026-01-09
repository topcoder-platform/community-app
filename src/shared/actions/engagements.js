import _ from 'lodash';
import { createActions } from 'redux-actions';
import { errors } from 'topcoder-react-lib';
import getEngagements from 'services/engagements';

const { fireErrorMessage } = errors;

const PAGE_SIZE = 10;

function getEngagementsInit(uuid, page, filters) {
  return { uuid, page, filters };
}

async function getEngagementsDone(uuid, page, filters, tokenV3) {
  try {
    const { engagements, meta } = await getEngagements(page, PAGE_SIZE, filters, tokenV3);

    return {
      uuid,
      engagements,
      meta,
      page,
    };
  } catch (error) {
    fireErrorMessage('Error Loading Engagements', (error && error.message) || error);
    return Promise.reject({ uuid, error });
  }
}

export default createActions({
  ENGAGEMENTS: {
    GET_ENGAGEMENTS_INIT: getEngagementsInit,
    GET_ENGAGEMENTS_DONE: getEngagementsDone,
    DROP_ENGAGEMENTS: _.noop,
    SET_FILTER: _.identity,
  },
});
