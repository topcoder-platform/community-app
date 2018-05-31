/**
 * This module contains the root reducer factory for the Topcoder Community
 * App's state. The factory returns a promise which resolves to the reducer.
 * It accepts ExpressJS HTTP request object as its only optional arguments.
 *
 * In case the argument is provided, the factory assumes server-side rendering,
 * and it can use data available in the HTTP request to preload any necessary
 * data to use as the default state.
 *
 * In case no argument is provided, the factory assumes client-side rendering
 * and should not spend time on creating the default state, as the store will
 * be created with the initial state passed from server anyway.
 *
 * To understand reducers read http://redux.js.org/docs/basics/Reducers.html.
 */

import _ from 'lodash';
import { getCommunityId } from 'server/services/communities';
import { redux } from 'topcoder-react-utils';
import { reducer as toastrReducer } from 'react-redux-toastr';
import { reducerFactory } from 'topcoder-react-lib';
import { getAuthTokens } from 'utils/tc';

import contentful from './contentful';
import topcoderHeader from './topcoder_header';
import rss from './rss';
import { factory as challengeListingFactory } from './challenge-listing';
import { factory as examplesFactory } from './examples';
import { factory as pageFactory } from './page';
import { factory as tcCommunitiesFactory } from './tc-communities';
import { factory as leaderboardFactory } from './leaderboard';
import { factory as scoreboardFactory } from './tco/scoreboard';
import { factory as termsFactory } from './terms';

/**
 * Given HTTP request, generates options for SSR by topcoder-react-lib's reducer
 * factory.
 * @param {ExpressJsHttpRequest} req
 * @return {Object} Options.
 */
function generateSsrOptions(req) {
  const res = {};
  res.auth = getAuthTokens(req);
  if (req.url.match(/^\/challenges\/\d+\/my-submissions/)) {
    const challengeId = req.url.match(/\d+/)[0];
    _.set(res, 'challenge.challengeDetails.id', challengeId);
    _.set(res, 'challenge.challengeDetails.mySubmission', true);
  } else if (req.url.match(/\/challenges\/\d+([?/].*)?$/)) {
    const challengeId = req.url.match(/\d+/)[0];
    _.set(res, 'challenge.challengeDetails.id', challengeId);
  }

  /* TODO: This should do SSR for terms of use, but this is messy,
   * thus commented out until we are in position to carefully test
   * and bring it back in use. */
  /*
  if (req) {
    let entity;

    // if it's challenge details page
    if (req.url.match(/^\/challenges\/\d+/)) {
      const challengeId = req.url.match(/\d+/)[0];
      entity = { type: 'challenge', id: challengeId };
    }

    // if it's community page
    let communityId = getCommunityId(req.subdomains);
    */
  // if (!communityId && req.url.match(/\/community\/.*/)) {
  /*
      [,, communityId] = req.url.split('/');
      // remove possible params like ?join=<communityId>
    */
  // communityId = communityId ? communityId.replace(/\?.*/, '') : communityId;
  /*
    }
    if (!entity && communityId) {
      entity = { type: 'community', id: communityId };
    }

    // set options for the entity
    if (entity) {
      options.auth = getAuthTokens(req);
      _.set(options, 'terms.entity.type', entity.type);
      _.set(options, 'terms.entity.id', entity.id);

      return reducers.terms.factory(options).then((res) => {
        // if we try to join community automatically, but not all terms are agreed,
        // then we show terms modal (also we make sure is logged in before open)
        if (options.auth.tokenV3 && req.query.join && !_.every
          (options.initialState.terms, 'agreed')) {
          const newState = onOpenTermsModal(options.initialState,
            actions.terms.openTermsModal('ANY'));
          return reducers.terms.factory({
            initialState: newState,
            mergeReducers: options.mergeReducers,
          });
        }
        return res;
      });
    }
  }
  */

  return res;
}

export function factory(req) {
  return redux.resolveReducers({
    standard: reducerFactory(req && generateSsrOptions(req)),
    challengeListing: challengeListingFactory(req),
    examples: examplesFactory(req),
    tcCommunities: tcCommunitiesFactory(req),
    leaderboard: leaderboardFactory(req),
    scoreboard: scoreboardFactory(req),
    terms: termsFactory(req),
    page: pageFactory(req),
  }).then(resolvedReducers => redux.combineReducers((state) => {
    const res = { ...state };
    if (req) {
      res.domain = `${req.protocol}://${req.headers.host || req.hostname}`;
      res.subdomainCommunity = getCommunityId(req.subdomains);
    }
    return res;
  }, {
    ..._.omit(resolvedReducers, 'standard'),
    ...resolvedReducers.standard,
    terms: resolvedReducers.terms,
    contentful,
    topcoderHeader,
    rss,
    toastr: toastrReducer,
  }));
}

export default undefined;
