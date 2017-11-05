/**
 * Reducer for actions related to the design submission page only.
 */

import _ from 'lodash';
import actions, { isValidStockArtRecord } from 'actions/page/submission/design';
import shortId from 'shortid';
import { handleActions } from 'redux-actions';

/**
 * Reducer that resets this segment of the store to the initial state.
 * @param {Object} state
 * @return {Object} New state.
 */
function onReset(state) {
  return {
    ...state,
    stockArtRecords: [],
  };
}

/**
 * Adds/edits/removes stock art records.
 * @param {Object} state
 * @param {Number} action.payload.index
 * @param {Object} action.payload.record
 * @return {Object} New state.
 */
function onSetStockArtRecord(state, action) {
  const { index, record } = action.payload;
  const stockArtRecords = _.clone(state.stockArtRecords);
  if (!record) stockArtRecords.splice(index, 1);
  else {
    const r = _.clone(record);
    r.errors = isValidStockArtRecord(r);
    if (!r.key) r.key = shortId();
    if (!_.isNumber(index) || index >= stockArtRecords.length) {
      stockArtRecords.push(r);
    } stockArtRecords[index] = r;
  }
  return { ...state, stockArtRecords };
}

/**
 * Creates a new reducer.
 * @param {Object} state Optional. Initial state.
 * @return {Function} Reducer.
 */
function create(state) {
  const a = actions.page.submission.design;
  return handleActions({
    [a.reset]: onReset,
    [a.setStockArtRecord]: onSetStockArtRecord,
  }, _.defaults(state, {
    stockArtRecords: [],
  }));
}

export default create();
