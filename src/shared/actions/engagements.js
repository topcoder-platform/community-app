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
    const { message: errorMessage } = error || {};
    let message = 'Unknown error';
    if (errorMessage) {
      message = errorMessage;
    } else if (typeof error === 'string') {
      message = error;
    }
    fireErrorMessage('Error Loading Engagements', message);
    const rejection = error instanceof Error ? error : new Error(message);
    rejection.uuid = uuid;
    rejection.originalError = error;
    return Promise.reject(rejection);
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
