/**
 * Redux Reducer for state.page
 *
 * Description:
 *  Implements reducer factory for the state.page segment of Redux state; and
 *  combines it with the child state.page.x reducer factories.
 */

import { combineReducers } from 'redux';
import { redux } from 'topcoder-react-utils';

import submission, { factory as submissionFactory } from './submission';

import submissionManagement from './submission_management';

import challengeDetails, { factory as challengeDetailsFactory }
  from './challenge-details';

import communities from './communities';
import dashboard from './dashboard';
import ui, { factory as uiFactory } from './ui';
import settings, { factory as settingsFactory } from './settings';


import hallOfFame, { factory as hallOfFameFactory } from './hallOfFame';
import reviewOpportunityDetails from './review-opportunity-details';

/**
 * Reducer factory.
 * @param {Object} req ExpressJS HTTP Request.
 * @return {Function} Reducer.
 */
export function factory(req) {
  return redux.resolveReducers({
    challengeDetails: challengeDetailsFactory(req),
    submission: submissionFactory(req),
    hallOfFame: hallOfFameFactory(req),
    settings: settingsFactory(req),
    ui: uiFactory(req),
  }).then(reducers => combineReducers({
    ...reducers,
    communities,
    dashboard,
    reviewOpportunityDetails,
    submissionManagement,
  }));
}

export default combineReducers({
  challengeDetails,
  communities,
  dashboard,
  settings,
  hallOfFame,
  reviewOpportunityDetails,
  submission,
  ui,
  submissionManagement,
});
