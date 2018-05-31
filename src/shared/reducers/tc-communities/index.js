/**
 * This module contains a reducer for tc-communities related state
 */

/* global alert */

import _ from 'lodash';
import actions from 'actions/tc-communities';
import { logger, services, errors } from 'topcoder-react-lib';
import { handleActions } from 'redux-actions';
import { decodeToken } from 'tc-accounts';
import { getAuthTokens } from 'utils/tc';
import { STATE as JOIN_COMMUNITY } from 'components/tc-communities/JoinCommunity';
import { getCommunityId } from 'server/services/communities';
import { isomorphy, redux } from 'topcoder-react-utils';

import { factory as metaFactory } from './meta';
import { factory as newsFactory } from './news';

const { fireErrorMessage } = errors;
const getTermsService = services.terms.getService;

function onJoinDone(state, action) {
  if (action.error) {
    logger.error('Failed to join the group!', action.payload);

    /* NOTE: Using alert is, probably, not a best practice, but will work just
     * fine for now. Anyway, if everything works fine, users are not supposed
     * to see it normally. */
    if (isomorphy.isClientSide()) {
      alert('Failed to join the group!'); // eslint-disable-line no-alert
    }

    return { ...state, joinCommunityButton: JOIN_COMMUNITY.DEFAULT };
  }
  return { ...state, joinCommunityButton: JOIN_COMMUNITY.JOINED };
}

/**
 * Handler for GET_LIST_INIT action.
 * @param {Object} state Old state.
 * @param {Object} action Action result.
 * @return {Object} New state.
 */
function onGetListInit(state, { payload }) {
  const list = { ...state.list, loadingUuid: payload };
  return { ...state, list };
}

/**
 * Handler for GET_LIST_DONE action.
 * @param {Object} state Old state.
 * @param {Object} action Action result.
 * @return {Object} New state.
 */
function onGetListDone(state, { error, payload }) {
  if (error) {
    fireErrorMessage('Failed to fetch sub-communities listing', '');
    logger.error(payload);
    return state;
  }
  const { list, uuid } = payload;
  if (uuid !== state.list.loadingUuid) return state;
  return {
    ...state,
    list: {
      data: list,
      loadingUuid: '',
      timestamp: Date.now(),
    },
  };
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
    [a.getListInit]: onGetListInit,
    [a.getListDone]: onGetListDone,
  }, _.defaults(_.clone(initialState), {
    joinCommunityButton: JOIN_COMMUNITY.DEFAULT,
    list: {
      data: [],
      loadingUuid: '',
      timestamp: 0,
    },
  }));
}

export function factory(req) {
  let joinPromise;
  if (req) {
    const { tokenV2, tokenV3 } = getAuthTokens(req);
    const joinGroupId = req.query && req.query.join;

    // get community id
    let communityId = getCommunityId(req.subdomains);
    if (!communityId && req.url.startsWith('/community')) {
      [,, communityId] = req.url.split('/');
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
          return redux.resolveAction(actions.tcCommunity.joinDone(
            tokenV3,
            joinGroupId,
            user.userId,
          ));
        }

        return false;
      });
    }
  }

  return Promise.all([
    redux.resolveReducers({
      meta: metaFactory(req),
      news: newsFactory(req),
    }),
    joinPromise,
  ]).then(([reducers, joinResult]) => {
    let state;
    if (joinResult) {
      state = onJoinDone({}, joinResult);
    }
    return redux.combineReducers(create(state), {
      ...reducers,
    });
  });
}

export default undefined;
