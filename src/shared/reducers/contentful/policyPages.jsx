/**
 * Reducer for state.policyPages
 */
import _ from 'lodash';
import actions from 'actions/contentful';
import { handleActions } from 'redux-actions';

function onGetPolicyPagesInit(state) {
  return {
    ...state,
    loadingPolicyPages: true,
  };
}

function onGetPolicyPagesDone(state, action) {
  const policyData = _.groupBy(action.payload.data.map(pp => pp.fields), 'menuSection');
  return {
    ...state,
    loadingPolicyPages: false,
    policyData,
  };
}

/**
 * Creates challengesBlock reducer with the specified initial state.
 * @param {Object} state Optional. If not given, the default one is
 *  generated automatically.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  return handleActions({
    [actions.contentful.getPolicyPagesInit]: onGetPolicyPagesInit,
    [actions.contentful.getPolicyPagesDone]: onGetPolicyPagesDone,
  }, state);
}

/* Reducer with the default initial state. */
export default create();
