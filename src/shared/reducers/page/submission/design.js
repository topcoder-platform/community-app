/**
 * Reducer for actions related to the design submission page only.
 */

import _ from 'lodash';
import actions, { isValidStockArtRecord, isValidCustomFontRecord } from 'actions/page/submission/design';
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
    customFontRecords: [],
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
 * Adds/edits/removes custom font records.
 * @param {Object} state
 * @param {Number} action.payload.index
 * @param {Object} action.payload.record
 * @return {Object} New state.
 */
function onSetCustomFontRecord(state, action) {
  const { index, record } = action.payload;
  const customFontRecords = _.clone(state.customFontRecords);
  if (!record) customFontRecords.splice(index, 1);
  else {
    const r = _.clone(record);
    r.errors = isValidCustomFontRecord(r);
    if (!r.key) r.key = shortId();
    if (!_.isNumber(index) || index >= customFontRecords.length) {
      customFontRecords.push(r);
    } customFontRecords[index] = r;
  }
  return { ...state, customFontRecords };
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
    [a.setCustomFontRecord]: onSetCustomFontRecord,
  }, _.defaults(state, {
    stockArtRecords: [],
    customFontRecords: [],
  }));
}

export default create();
