/**
 * Reducer that handles UI state of the member payments listing page.
 */

import _ from 'lodash';
import actions from 'actions/page/sandbox/payments/listing';
import { handleActions } from 'redux-actions';

/**
 * Selects the specified project.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onSelectProject(state, { payload }) {
  return { ...state, selectedProjectId: payload };
}

/**
 * Creates reducer with the specified initial state, or default state otherwise.
 * @param {Object} state Optional. Initial state. If not given, default state
 *  will be generated.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  const a = actions.page.sandbox.payments.listing;
  return handleActions({
    [a.selectProject]: onSelectProject,
  }, _.defaults(state, {
    selectedProjectId: 0,
  }));
}

export default create();
