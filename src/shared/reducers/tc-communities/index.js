/**
 * This module contains a reducer for tc-communities related state
 */

/* global alert */

import _ from 'lodash';
import actions from 'actions/tc-communities';
import logger from 'utils/logger';
import { handleActions } from 'redux-actions';
import { combine, resolveReducers } from 'utils/redux';

import { factory as metaFactory } from './meta';
import { factory as newsFactory } from './news';

function onJoinDone(state, action) {
  if (action.error) {
    logger.error('Failed to join the group!', action.payload);

    /* NOTE: Using alert is, probably, not a best practice, but will work just
     * fine for now. Anyway, if everything works fine, users are not supposed
     * to see it normally. */
    alert('Failed to join the group!'); // eslint-disable-line no-alert

    return { ...state, joined: false, joining: false };
  }
  return { ...state, joined: true };
}

function create(initialState = {}) {
  const a = actions.tcCommunity;
  return handleActions({
    [a.hideJoinButton]: state => ({ ...state, hideJoinButton: true }),
    [a.joinInit]: state => ({ ...state, joining: true }),
    [a.joinDone]: onJoinDone,
  }, _.defaults(_.clone(initialState), {
    hideJoinButton: false,
    joined: false,
    joining: false,
  }));
}

export function factory(req) {
  return resolveReducers({
    meta: metaFactory(req),
    news: newsFactory(req),
  }).then(reducers => combine(create(), {
    ...reducers,
  }));
}

export default undefined;
