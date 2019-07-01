/**
 * Redux Reducer for state.challenge-list frontend
 *
 * Description:
 *  Implements reducer factory for the state.page segment of Redux state; and
 *  combines it with the child state.challengeListFrontend.x reducer factories.
 */

import { combineReducers } from 'redux';
import { redux } from 'topcoder-react-utils';

import filterPanel, { factory as filterPanelFactory } from './filter-panel';
import sidebar, { factory as sidebarFactory } from './sidebar';

/**
 * Reducer factory.
 * @param {Object} req ExpressJS HTTP Request.
 * @return {Function} Reducer.
 */
export function factory(req) {
  return redux.resolveReducers({
    filterPanel: filterPanelFactory(req),
    sidebar: sidebarFactory(req),
  }).then(reducers => combineReducers({
    ...reducers,
    filterPanel,
    sidebar,
  }));
}

export default combineReducers({
  filterPanel,
  sidebar,
});
