/**
 * This module contains a reducer for tc-communities related state
 */

/* global alert */

import _ from 'lodash';
import actions from 'actions/tc-communities';
import logger from 'utils/logger';
import { handleActions } from 'redux-actions';
import { decodeToken } from 'tc-accounts';
import { isClientSide } from 'utils/isomorphy';
import { combine, resolveReducers, toFSA } from 'utils/redux';
import { getAuthTokens } from 'utils/tc';
import { STATE as JOIN_COMMUNITY } from 'components/tc-communities/JoinCommunity';
import { getService as getTermsService } from 'services/terms';
import { getCommunityId } from 'server/services/communities';

import { factory as metaFactory } from './meta';
import { factory as newsFactory } from './news';

function onJoinDone(state, action) {
  if (action.error) {
    logger.error('Failed to join the group!', action.payload);

    /* NOTE: Using alert is, probably, not a best practice, but will work just
     * fine for now. Anyway, if everything works fine, users are not supposed
     * to see it normally. */
    if (isClientSide()) {
      alert('Failed to join the group!'); // eslint-disable-line no-alert
    }

    return { ...state, joinCommunityButton: JOIN_COMMUNITY.DEFAULT };
  }
  return { ...state, joinCommunityButton: JOIN_COMMUNITY.JOINED };
}

function create(initialState = {}) {
  const a = actions.tcCommunity;
  return handleActions({
    [a.hideJoinButton]: state => ({
      ...state, joinCommunityButton: JOIN_COMMUNITY.HIDDEN,
    }),
    [a.joinInit]: state => ({
      ...state, joinCommunityButton: JOIN_COMMUNITY.JOINING,
    }),
    [a.joinDone]: onJoinDone,
    [a.resetJoinButton]: state => ({
      ...state, joinCommunityButton: JOIN_COMMUNITY.DEFAULT,
    }),
    [a.showJoinConfirmModal]: state => ({
      ...state, joinCommunityButton: JOIN_COMMUNITY.CONFIRM_JOIN,
    }),
    [a.getList]: (state, action) => ({
      ...state,
      list: action.error ? [] : action.payload,
    }),
  }, _.defaults(_.clone(initialState), {
    joinCommunityButton: JOIN_COMMUNITY.DEFAULT,
    list: [],
  }));
}

export function factory(req) {
  let joinPromise;
  if (req) {
    const tokenV2 = getAuthTokens(req).tokenV2;
    const tokenV3 = getAuthTokens(req).tokenV3;
    const joinGroupId = req.query && req.query.join;

    // get community id
    let communityId = getCommunityId(req.subdomains);
    if (!communityId && req.url.startsWith('/community')) {
      communityId = req.url.split('/')[2];
      // remove possible params like ?join=<communityId>
      communityId = communityId ? communityId.replace(/\?.*/, '') : communityId;
    }

    if (communityId && joinGroupId && tokenV3) {
      const user = decodeToken(tokenV3);

      // as server doesn't check if user agreed with all community terms make it manually for now
      const termsService = getTermsService(tokenV2);
      joinPromise = termsService.getCommunityTerms(communityId, tokenV3).then((result) => {
        // if all terms agreed we can perform join action
        if (_.every(result.terms, 'agreed')) {
          return toFSA(
            actions.tcCommunity.joinDone(tokenV3, joinGroupId, user.userId),
          );
        }

        return false;
      });
    }
  }

  return Promise.all([
    resolveReducers({
      meta: metaFactory(req),
      news: newsFactory(req),
    }),
    joinPromise,
  ]).then(([reducers, joinResult]) => {
    let state;
    if (joinResult) {
      state = onJoinDone({}, joinResult);
    }
    return combine(create(state), {
      ...reducers,
    });
  });
}

export default undefined;
