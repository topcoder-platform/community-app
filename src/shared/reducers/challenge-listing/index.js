/**
 * Reducer for state.challengeListing.
 */

import _ from 'lodash';
import actions from 'actions/challenge-listing';
import logger from 'utils/logger';
import { handleActions } from 'redux-actions';
import { combine, resolveReducers } from 'utils/redux';
import { updateQuery } from 'utils/url';
import moment from 'moment';
import { getFilterFunction } from 'utils/challenge-listing/filter';
import { fireErrorMessage } from 'utils/errors';

import filterPanel from '../challenge-listing/filter-panel';
import sidebar, { factory as sidebarFactory } from '../challenge-listing/sidebar';

function onGetAllActiveChallengesDone(state, { error, payload }) {
  if (error) {
    logger.error(payload);
    return state;
  }
  const { uuid, challenges: loaded } = payload;
  if (uuid !== state.loadingActiveChallengesUUID) return state;

  /* Once all active challenges are fetched from the API, we remove from the
   * store any active challenges stored there previously, and also any
   * challenges with IDs matching any challenges loaded now as active. */
  const ids = new Set();
  loaded.forEach(item => ids.add(item.id));
  const challenges = state.challenges
    .filter(item => item.status !== 'ACTIVE' && !ids.has(item.id))
    .concat(loaded);

  return {
    ...state,
    challenges,
    lastUpdateOfActiveChallenges: Date.now(),
    loadingActiveChallengesUUID: '',
  };
}

function onGetAllActiveChallengesInit(state, { payload }) {
  return { ...state, loadingActiveChallengesUUID: payload };
}

/**
 * Handles CHALLENGE_LISTING/GET_CHALLENGE_SUBTRACKS_DONE action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object}
 */
function onGetChallengeSubtracksDone(state, action) {
  if (action.error) logger.error(action.payload);
  return {
    ...state,
    challengeSubtracks: action.error ? [] : action.payload,
    challengeSubtracksMap: action.error ? {} : _.keyBy(action.payload, 'subTrack'),
    loadingChallengeSubtracks: false,
  };
}

/**
 * Handles CHALLENGE_LISTING/GET_CHALLENGE_TAGS_DONE action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object}
 */
function onGetChallengeTagsDone(state, action) {
  if (action.error) logger.error(action.payload);
  return {
    ...state,
    challengeTags: action.error ? [] : action.payload,
    loadingChallengeTags: false,
  };
}

function onGetDraftChallengesInit(state, { payload: { uuid, page } }) {
  return {
    ...state,
    lastRequestedPageOfDraftChallenges: page,
    loadingDraftChallengesUUID: uuid,
  };
}

function onGetDraftChallengesDone(state, { error, payload }) {
  if (error) {
    logger.error(payload);
    return state;
  }
  const { uuid, challenges: loaded } = payload;
  if (uuid !== state.loadingDraftChallengesUUID) return state;

  const ids = new Set();
  loaded.forEach(item => ids.add(item.id));

  /* Fetching 0 page of draft challenges also drops any draft challenges
   * loaded to the state before. */
  const filter = state.lastRequestedPageOfDraftChallenges
    ? item => !ids.has(item.id)
    : item => !ids.has(item.id) && item.status !== 'DRAFT';

  const challenges = state.challenges
    .filter(filter).concat(loaded);

  return {
    ...state,
    allDraftChallengesLoaded: loaded.length === 0,
    challenges,
    loadingDraftChallengesUUID: '',
  };
}

function onGetPastChallengesInit(state, action) {
  const { frontFilter, page, uuid } = action.payload;
  const tracks = frontFilter && frontFilter.tracks;
  if (tracks && _.isEmpty(tracks)) {
    return {
      ...state,
      allPastChallengesLoaded: true,
      loadingPastChallengesUUID: '',
    };
  }

  return {
    ...state,
    lastRequestedPageOfPastChallenges: page,
    loadingPastChallengesUUID: uuid,
  };
}

function onGetPastChallengesDone(state, { error, payload }) {
  if (error) {
    logger.error(payload);
    return state;
  }
  const { uuid, challenges: loaded, frontFilter } = payload;
  if (uuid !== state.loadingPastChallengesUUID) return state;

  const ids = new Set();
  loaded.forEach(item => ids.add(item.id));

  /* Fetching 0 page of past challenges also drops any past challenges
   * loaded to the state before. */
  const filter = state.lastRequestedPageOfPastChallenges
    ? item => !ids.has(item.id)
    : item => !ids.has(item.id) && item.status !== 'COMPLETED' && item.status !== 'PAST';

  const challenges = state.challenges.filter(filter).concat(loaded);

  let keepPastPlaceholders = false;
  if (loaded.length) {
    const ff = getFilterFunction(frontFilter);
    keepPastPlaceholders =
      challenges.filter(ff).length - state.challenges.filter(ff).length < 10;
  }

  return {
    ...state,
    allPastChallengesLoaded: loaded.length === 0,
    challenges,
    keepPastPlaceholders,
    loadingPastChallengesUUID: '',
  };
}

function onSelectCommunity(state, { payload }) {
  updateQuery({ communityId: payload || undefined });
  return {
    ...state,
    selectedCommunityId: payload,

    /* Page numbers of past/upcoming challenges depend on the filters. To keep
      * the code simple we just reset them each time a filter is modified.
      * (This community selection defines community-specific filter for
      * challenges). */
    allDraftChallengesLoaded: false,
    allPastChallengesLoaded: false,
    lastRequestedPageOfDraftChallenges: -1,
    lastRequestedPageOfPastChallenges: -1,
  };
}

/**
 * @param {Object} state
 * @param {Object} action
 * @return {Object}
 */
function onSetFilter(state, { payload }) {
  /* Validation of filter parameters: they may come from URL query, thus
   * validation is not a bad idea. As you may note, at the moment we do not
   * do it very carefuly (many params are not validated). */
  const filter = _.clone(payload);
  if (_.isPlainObject(filter.tags)) {
    filter.tags = _.values(filter.tags);
  }
  if (_.isPlainObject(filter.subtracks)) {
    filter.subtracks = _.values(filter.subtracks);
  }
  if (filter.startDate && !moment(filter.startDate).isValid()) {
    delete filter.startDate;
  }
  if (filter.endDate && !moment(filter.endDate).isValid()) {
    delete filter.endDate;
  }

  /* Update of URL and generation of the state. */
  updateQuery({ filter });
  return {
    ...state,
    filter,

    /* Page numbers of past/upcoming challenges depend on the filters. To keep
     * the code simple we just reset them each time a filter is modified. */
    allDraftChallengesLoaded: false,
    allPastChallengesLoaded: false,
    lastRequestedPageOfDraftChallenges: -1,
    lastRequestedPageOfPastChallenges: -1,
  };
}

/**
 * Handles CHALLENGE_LISTING/GET_REVIEW_OPPORTUNITIES_INIT action.
 * @param {Object} state
 * @param {Object} action Payload will be page, uuid
 * @return {Object} New state
 */
function onGetReviewOpportunitiesInit(state, { payload }) {
  return {
    ...state,
    lastRequestedPageOfReviewOpportunities: payload.page,
    loadingReviewOpportunitiesUUID: payload.uuid,
  };
}

/**
 * Handles CHALLENGE_LISTING/GET_REVIEW_OPPORTUNITIES_DONE action.
 * @param {Object} state
 * @param {Object} action Payload will be JSON from api call and UUID
 * @return {Object} New state
 */
function onGetReviewOpportunitiesDone(state, { payload, error }) {
  if (error) {
    return state;
  }

  const {
    uuid,
    loaded,
  } = payload;

  if (uuid !== state.loadingReviewOpportunitiesUUID) return state;

  const ids = new Set();
  loaded.forEach(item => ids.add(item.id));
  const reviewOpportunities = state.reviewOpportunities
    .filter(item => !ids.has(item.id))
    .concat(loaded);

  return {
    ...state,
    reviewOpportunities,
    loadingReviewOpportunitiesUUID: '',
    allReviewOpportunitiesLoaded: loaded.length === 0,
  };
}

/**
 * Inits the loading of SRMs.
 * @param {Object} state
 * @param {String} payload Operation UUID.
 * @return {Object} New state.
 */
function onGetSrmsInit(state, { payload }) {
  return {
    ...state,
    srms: {
      ...state.srms,
      loadingUuid: payload,
    },
  };
}

/**
 * Handles loaded SRMs.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetSrmsDone(state, { error, payload }) {
  if (error) {
    logger.error('Failed to load SRMs', payload);
    fireErrorMessage('Failed to load SRMs', '');
    return state;
  }

  const { uuid, data } = payload;
  if (state.srms.loadingUuid !== uuid) return state;
  return {
    ...state,
    srms: {
      data,
      loadingUuid: '',
      timestamp: Date.now(),
    },
  };
}

/**
 * Creates a new Challenge Listing reducer with the specified initial state.
 * @param {Object} initialState Optional. Initial state.
 * @return Challenge Listing reducer.
 */
function create(initialState) {
  const a = actions.challengeListing;
  return handleActions({
    [a.dropChallenges]: state => ({
      ...state,
      allDraftChallengesLoaded: false,
      allPastChallengesLoaded: false,
      allReviewOpportunitiesLoaded: false,
      challenges: [],
      lastRequestedPageOfDraftChallenges: -1,
      lastRequestedPageOfPastChallenges: -1,
      lastRequestedPageOfReviewOpportunities: -1,
      lastUpdateOfActiveChallenges: 0,
      loadingActiveChallengesUUID: '',
      loadingDraftChallengesUUID: '',
      loadingPastChallengesUUID: '',
      loadingReviewOpportunitiesUUID: '',
      reviewOpportunities: [],
    }),

    [a.expandTag]: (state, { payload }) =>
      ({ ...state, expandedTags: [...state.expandedTags, payload] }),

    [a.getAllActiveChallengesInit]: onGetAllActiveChallengesInit,
    [a.getAllActiveChallengesDone]: onGetAllActiveChallengesDone,

    [a.getChallengeSubtracksInit]: state => ({
      ...state,
      loadingChallengeSubtracks: true,
    }),
    [a.getChallengeSubtracksDone]: onGetChallengeSubtracksDone,

    [a.getChallengeTagsInit]: state => ({
      ...state,
      loadingChallengeTags: true,
    }),
    [a.getChallengeTagsDone]: onGetChallengeTagsDone,

    [a.getDraftChallengesInit]: onGetDraftChallengesInit,
    [a.getDraftChallengesDone]: onGetDraftChallengesDone,

    [a.getPastChallengesInit]: onGetPastChallengesInit,
    [a.getPastChallengesDone]: onGetPastChallengesDone,

    [a.getReviewOpportunitiesInit]: onGetReviewOpportunitiesInit,
    [a.getReviewOpportunitiesDone]: onGetReviewOpportunitiesDone,

    [a.getSrmsInit]: onGetSrmsInit,
    [a.getSrmsDone]: onGetSrmsDone,

    [a.selectCommunity]: onSelectCommunity,

    [a.setFilter]: onSetFilter,
    [a.setSort]: (state, { payload }) => ({
      ...state,
      sorts: {
        ...state.sorts,
        [payload.bucket]: payload.sort,
      },
    }),
  }, _.defaults(_.clone(initialState) || {}, {
    allDraftChallengesLoaded: false,
    allPastChallengesLoaded: false,
    allReviewOpportunitiesLoaded: false,

    challenges: [],
    challengeSubtracks: [],
    challengeSubtracksMap: {},
    challengeTags: [],

    expandedTags: [],

    filter: {},

    keepPastPlaceholders: false,

    lastRequestedPageOfDraftChallenges: -1,
    lastRequestedPageOfPastChallenges: -1,
    lastRequestedPageOfReviewOpportunities: -1,
    lastUpdateOfActiveChallenges: 0,

    loadingActiveChallengesUUID: '',
    loadingDraftChallengesUUID: '',
    loadingPastChallengesUUID: '',
    loadingReviewOpportunitiesUUID: '',

    loadingChallengeSubtracks: false,
    loadingChallengeTags: false,

    reviewOpportunities: [],

    selectedCommunityId: '',

    sorts: {},

    srms: {
      data: [],
      loadingUuid: '',
      timestamp: 0,
    },
  }));
}

/**
 * The factory creates the new reducer with initial state tailored to the given
 * ExpressJS HTTP request, if specified (for server-side rendering). If no HTTP
 * request is specified, it creates the default reducer.
 * @param {Object} req Optional. ExpressJS HTTP request.
 * @return {Promise} Resolves to the new reducer.
 */
export function factory(req) {
  if (req && req.url.match(/challenges(\/?$|\?)/)) {
    let state = {};

    if (req.query.filter) {
      state = onSetFilter(state, { payload: req.query.filter });
    }
    state.selectedCommunityId = req.query.communityId;

    return resolveReducers({
      sidebar: sidebarFactory(req),
    }).then(reducers => combine(create(state), { ...reducers, filterPanel }));
  }

  return resolveReducers({
    sidebar: sidebarFactory(req),
  }).then(reducers => combine(create(), { ...reducers, filterPanel }));
}

/* Default reducer with empty initial state. */
export default combine(create(), { filterPanel, sidebar });
