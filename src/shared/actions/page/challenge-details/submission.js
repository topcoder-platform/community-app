/**
 * actions.page.challenge-details.submission
 *
 * Description:
 *   Contains the Redux Actions for updating the Submission page UI
 *   and for for uploading submissions to back end
 */
import _ from 'lodash';
import { createActions } from 'redux-actions';
import { getService as getChallengesService } from 'services/challenges';

/**
 * Payload creator for the action that actually performs submission operation.
 * @param {String} tokenV3
 * @param {String} tokenV2
 * @param {String} submissionId
 * @param {Object} body Data to submit.
 * @param {String} track Competition track of the challenge where we submit.
 * @return Promise
 */
function submitDone(tokenV3, tokenV2, submissionId, body, track, progress) {
  return getChallengesService(tokenV3, tokenV2)
    .submit(body, submissionId, track, progress);
}

/**
 * Export Actions for usage by Redux
 */
export default createActions({
  PAGE: {
    CHALLENGE_DETAILS: {
      SUBMISSION: {
        SUBMIT_INIT: _.noop,
        SUBMIT_DONE: submitDone,
        SUBMIT_RESET: _.noop,
        UPLOAD_PROGRESS: percent => percent,
        SET_AGREED: agreed => agreed,
        SET_FILE_PICKER_ERROR: (id, error) => ({ id, error }),
        SET_FILE_PICKER_FILE_NAME: (id, fileName) => ({ id, fileName }),
        SET_FILE_PICKER_DRAGGED: (id, dragged) => ({ id, dragged }),
        UPDATE_NOTES_LENGTH: length => length,
        REMOVE_MULTI_INPUT: (id, index) => ({ id, index }),
        SET_MULTI_INPUT_URL_VALID: (id, index, valid) => ({ id, index, valid }),
        SET_MULTI_INPUT_NAME_VALID: (id, index, valid) => ({ id, index, valid }),
        SET_MULTI_INPUT_SOURCE_VALID: (id, index, valid) => ({ id, index, valid }),
        SET_MULTI_INPUT_ACTIVE: (id, index, active) => ({ id, index, active }),
        SET_SUBMISSION_FILESTACK_DATA: data => data,
        SET_SOURCE_FILESTACK_DATA: data => data,
        SET_PREVIEW_FILESTACK_DATA: data => data,
      },
    },
  },
});
