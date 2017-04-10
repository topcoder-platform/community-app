/**
 * My submissions management page specific actions.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import { getApiV2, getApiV3 } from 'services/api';

const apiV2 = (auth) => getApiV2(auth.tokenV2);
const apiV3 = (auth) => getApiV3(auth.tokenV3);

function deleteSubmission(challengeId, submissionId) {
  // TODO: replace Promise.resolve with the actual api call to delete the submission
  // eg: getApiV3().delete(`/challenges/${challengeId}/submissions/${submissionId}`);

  return Promise.resolve(submissionId);
}

function downloadSubmission(tokens, type, submissionId) {
  return apiV2(tokens).fetch(`/${type}/download/${submissionId}?submissionType=${'original'}`);
}

export default createActions({
  SMP: {
    SHOW_DETAILS: _.identity,
    CANCEL_DELETE: _.noop,
    CONFIRM_DELETE: _.identity,
    DELETE_SUBMISSION_DONE: deleteSubmission,
    DOWNLOAD_SUBMISSION: downloadSubmission,
  }
});
