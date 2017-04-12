/**
 * My submissions management page specific actions.
 */

/* global fetch */

import _ from 'lodash';
import 'isomorphic-fetch';
import { createActions } from 'redux-actions';
import { getApiV2, getApiV3 } from 'services/api';
import config from 'utils/config';
import logger from 'utils/logger';

const apiV2 = (auth) => getApiV2(auth.tokenV2);
const apiV3 = (auth) => getApiV3(auth.tokenV3);

function deleteSubmission(challengeId, submissionId) {
  // TODO: replace Promise.resolve with the actual api call to delete the submission
  // eg: getApiV3().delete(`/challenges/${challengeId}/submissions/${submissionId}`);

  return Promise.resolve(submissionId);
}

function downloadSubmission(tokens, type, submissionId) {
  /*
    TODO: This will work with legacy API once we pass the tcsso cookie
    along with the request.
  const url = `${config.STUDIO_URL}?module=DownloadSubmission&sbmid=${submissionId}&sbt=original`;
  fetch(url, {
    mode: 'no-cors',
  });
  */
  const endpoint = `/${type}/download/${submissionId}?submissionType=original`;
  return apiV2(tokens).get(endpoint).then(res =>
    new Promise(resolve =>
      res.json().then((json) => {
        if (res.status !== 200) logger.error(json);
        resolve(json);
      }),
    ),
  );
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
