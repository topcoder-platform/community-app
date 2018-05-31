/**
 * actions.page.challenge-details.submission
 *
 * Description:
 *   Contains the Redux Actions for updating the Submission page UI
 *   and for for uploading submissions to back end
 */
import _ from 'lodash';
import { createActions } from 'redux-actions';
import { services } from 'topcoder-react-lib';

import design from './design';

const getChallengesService = services.challenge.getService;

/**
 * Payload creator for the action that actually performs submission operation.
 * @param {String} tokenV3
 * @param {String} tokenV2
 * @param {String} submissionId
 * @param {Object} body Data to submit.
 * @param {String} track Competition track of the challenge where we submit.
 * @param {Function} progress The callback to trigger with updates on the
 *  submission progress.
 * @return Promise
 */
function submitDone(tokenV3, tokenV2, submissionId, body, track, progress) {
  return getChallengesService(tokenV3, tokenV2)
    .submit(body, submissionId, track, progress);
}

/**
 * Export Actions for usage by Redux
 */
export default _.merge(createActions({
  PAGE: {
    SUBMISSION: {
      SUBMIT_INIT: _.noop,
      SUBMIT_DONE: submitDone,
      SUBMIT_RESET: _.noop,
      UPLOAD_PROGRESS: percent => percent,
      SET_AGREED: agreed => agreed,
      SET_FILE_PICKER_ERROR: (id, error) => ({ id, error }),
      SET_FILE_PICKER_FILE_NAME: (id, fileName) => ({ id, fileName }),
      SET_FILE_PICKER_UPLOAD_PROGRESS: (id, progress) => ({ id, progress }),
      SET_FILE_PICKER_DRAGGED: (id, dragged) => ({ id, dragged }),
      UPDATE_NOTES_LENGTH: length => length,
      SET_SUBMISSION_FILESTACK_DATA: data => data,
      SET_SOURCE_FILESTACK_DATA: data => data,
      SET_PREVIEW_FILESTACK_DATA: data => data,
    },
  },
}), design);
