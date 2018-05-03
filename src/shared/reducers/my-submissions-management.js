/* TODO: This reducer and corresponding actions control the UI state and logic
 * for the specific page (Submission Management Page). They should be moved to
 * page/challenge/submissions-management */

import { reducers } from 'topcoder-react-lib';
import actions from 'actions/smp';

/**
 * Factory which creates a new reducer with its initial state tailored to the
 * ExpressJS HTTP request, if specified (for server-side rendering). If HTTP
 * request is not specified, it creates just the default reducer.
 * @param {Object} req Optional. ExpressJS HTTP request.
 * @return Promise which resolves to the new reducer.
 */
export function factory() {
  const options = {
    initialState: {
      showDetails: [],
      showModal: false,
      toBeDeletedId: 0,
    },
    mergeReducers: {
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
    },
  };

  return reducers.mySubmissionsManagement.factory(options);
}

export default factory();
