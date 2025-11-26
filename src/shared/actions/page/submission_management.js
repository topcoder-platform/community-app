import _ from 'lodash';
import { redux, config } from 'topcoder-react-utils';
import { services } from 'topcoder-react-lib';

const Api = services.api.default;

function loadAiWorkflowRunsInit() {}

function loadAiWorkflowRunsDone(tokenV3, submissionId, aiWorkflowId) {
  const api = new Api(config.API.V6, tokenV3);
  const url = `/workflows/${aiWorkflowId}/runs?submissionId=${submissionId}`;

  return api.get(url)
    .then(res => res.json())
    .then(data => ({
      submissionId,
      aiWorkflowId,
      runs: data,
    }))
    .catch((err) => {
      throw err;
    });
}

export default redux.createActions({
  PAGE: {
    SUBMISSION_MANAGEMENT: {
      SHOW_DETAILS: _.identity,
      CANCEL_DELETE: _.noop,
      CONFIRM_DELETE: _.identity,
      LOAD_AI_WORKFLOW_RUNS_INIT: loadAiWorkflowRunsInit,
      LOAD_AI_WORKFLOW_RUNS_DONE: loadAiWorkflowRunsDone,
    },
  },
});
