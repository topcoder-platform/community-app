/**
 * Submit Actions
 */
import _ from 'lodash';
import { createActions } from 'redux-actions';
import { getService as getSubmitService } from 'services/submit';

function submitDone(tokenV3, tokenV2, submissionId, body, track) {
  const service = getSubmitService(
    tokenV3,
    tokenV2,
  );

  return service.startSubmissionDevelop(body, submissionId, track);
}

export default createActions({
  SUBMIT: {
    SUBMIT_INIT: _.noop,
    SUBMIT_DONE: submitDone,
    RESET: _.noop,
  },
});
