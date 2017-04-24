import { handleActions } from 'redux-actions';

import actions from 'actions/smp';

function create(initialState) {
  return handleActions({
    [actions.smp.showDetails]: (state, { payload }) => {
      const showDetails = new Set(state.showDetails);

      if (showDetails.has(payload)) {
        showDetails.delete(payload);
      } else {
        showDetails.add(payload);
      }

      return { ...state, showDetails };
    },

    [actions.smp.confirmDelete]: (state, { payload }) => ({
      ...state,
      showModal: true,
      toBeDeletedId: payload,
    }),

    [actions.smp.cancelDelete]: state => ({
      ...state,
      showModal: false,
      toBeDeletedId: 0,
    }),

    [actions.smp.deleteSubmissionDone]: state => ({
      ...state,
      deletingSubmission: false,
      showModal: false,
      toBeDeletedId: 0,
    }),

    [actions.smp.deleteSubmissionInit]: state => ({
      ...state,
      deletingSubmission: true,
    }),

  }, initialState || {});
}

/**
 * Factory which creates a new reducer with its initial state tailored to the
 * ExpressJS HTTP request, if specified (for server-side rendering). If HTTP
 * request is not specified, it creates just the default reducer.
 * @param {Object} req Optional. ExpressJS HTTP request.
 * @return Promise which resolves to the new reducer.
 */
export function factory() {
  const state = {
    showDetails: [],
    showModal: false,
    toBeDeletedId: 0,
  };

  return Promise.resolve(create(state));
}

export default create();
