/**
 * TODO: Most probably it is not fully functional, I believe a piece of
 * these functionality still should be moved to `topcoder-react-lib`.
 */

import _ from 'lodash';
import actions from 'actions/page/submission_management';
import { redux } from 'topcoder-react-utils';

function onShowDetails(state, { payload: id }) {
  const showDetails = _.clone(state.showDetails);
  if (showDetails[id]) delete showDetails[id];
  else showDetails[id] = true;
  return { ...state, showDetails };
}

function create(initialState = {}) {
  const a = actions.page.submissionManagement;
  return redux.handleActions({
    [a.showDetails]: onShowDetails,

    [a.confirmDelete]: (state, { payload }) => ({
      ...state,
      showModal: true,
      toBeDeletedId: payload,
    }),

    [a.cancelDelete]: state => ({
      ...state,
      showModal: false,
      toBeDeletedId: 0,
    }),

    'SMP/DELETE_SUBMISSION_DONE': state => ({
      ...state,
      deletingSubmission: false,
      showModal: false,
      toBeDeletedId: 0,
    }),

  }, _.defaults(initialState, {
    showDetails: {},
    showModal: false,
    toBeDeletedId: 0,
  }));
}

export default create();
