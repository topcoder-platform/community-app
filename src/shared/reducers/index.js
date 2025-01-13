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
import crypto from 'crypto';
import { getCommunityId } from 'server/services/communities';
import { redux, config, isomorphy } from 'topcoder-react-utils';
import { reducer as toastrReducer } from 'react-redux-toastr';
import { reducerFactory } from 'topcoder-react-lib';
import { getAuthTokens } from 'utils/tc';

import contentful from './contentful';
import topcoderHeader from './topcoder_header';
import rss from './rss';
import newsletterArchive from './newsletterArchive';
import menuNavigation from './contentful/menuNavigation';
import challengesBlock from './contentful/challengesBlock';
import policyPages from './contentful/policyPages';
import { factory as challengeListingFactory } from './challenge-listing';
import { factory as examplesFactory } from './examples';
import { factory as pageFactory } from './page';
import { factory as tcCommunitiesFactory } from './tc-communities';
import { factory as leaderboardFactory } from './leaderboard';
import { factory as scoreboardFactory } from './tco/scoreboard';
import { factory as termsFactory } from './terms';
import { factory as mfaFactory } from './mfa';
import mmLeaderboard from './mmLeaderboard';
import tcoLeaderboards from './tco/leaderboards';
import recruitCRM from './recruitCRM';
import gSheet from './gSheet';
import timelineWall from './timelineWall';
import thrive from './contentful/thrive';
import dashboard from './dashboard';
import blog from './blog';
import identity from './identity';

/**
 * Given HTTP request, generates options for SSR by topcoder-react-lib's reducer
 * factory.
 * @param {ExpressJsHttpRequest} req
 * @return {Object} Options.
 */
function generateSsrOptions(req) {
  const res = {
    auth: getAuthTokens(req),
  };
  if (req.url.match(/^\/challenges\/([\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}|\d{5,8})\/my-submissions/)) {
    const challengeId = req.url.match(/([\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}|\d{5,8})/)[0];
    _.set(res, 'challenge.challengeDetails.id', challengeId);
    _.set(res, 'challenge.challengeDetails.mySubmission', true);
  } else if (req.url.match(/\/challenges\/([\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}|\d{5,8})([?/].*)?$/)) {
    const challengeId = req.url.match(/([\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}|\d{5,8})/)[0];
    _.set(res, 'challenge.challengeDetails.id', challengeId);
  }

  /* TODO: This should do SSR for terms of use, but this is messy,
   * thus commented out until we are in position to carefully test
   * and bring it back in use. */
  /*
  if (req) {
    let entity;

    // if it's challenge details page
    if (req.url.match(/^\/challenges\/((([\w]{4,12}-?){5}|\d{5,8}))/)) {
      const challengeId = req.url.match(/((([\w]{4,12}-?){5}|\d{5,8}))/)[0];
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

/**
 * Generate user id hash for secure Identity verification
 * @param {Object} user
 * @return {String} User Id Hash.
 */
function generateUserIdHash(user) {
  const secret = _.get(config, 'SECRET.CHAMELEON_VERIFICATION_SECRET');
  const now = Math.floor(Date.now() / 1000);

  return [
    crypto.createHmac('sha256', secret).update(`${user.userId}-${now}`).digest('hex'),
    now,
  ].join('-');
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
    usermfa: mfaFactory(req),
    page: pageFactory(req),
  }).then(resolvedReducers => redux.combineReducers((state) => {
    const res = { ...state };

    const user = _.get(res, 'auth.user');
    if (user && isomorphy.isServerSide()) {
      res.auth.userIdHash = generateUserIdHash(user);
      // getM2mToken()
      //   .then(((token) => {
      //     res.auth.m2mToken = token;
      //   }));
    }

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
    newsletterArchive,
    menuNavigation,
    challengesBlock,
    policyPages,
    recruitCRM,
    mmLeaderboard,
    gSheet,
    thrive,
    tcoLeaderboards,
    dashboard,
    blog,
    timelineWall,
    identity,
  }));
}

export default undefined;
