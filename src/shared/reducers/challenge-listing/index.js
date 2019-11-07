/**
 * Reducer for state.challengeListing.
 */

import _ from 'lodash';
import actions from 'actions/challenge-listing';
import { handleActions } from 'redux-actions';
import { redux } from 'topcoder-react-utils';
import { updateQuery } from 'utils/url';
import moment from 'moment';
import { logger, errors, challenge as challengeUtils }
  from 'topcoder-react-lib';

import filterPanel from './filter-panel';
import sidebar, { factory as sidebarFactory } from './sidebar';

const { fireErrorMessage } = errors;
const { filter: Filter } = challengeUtils;

/** TODO: Inspect if the 2 actions bellow can be removed?
 * They do  duplicate what is done in `getActiveChallengesDone` but fetch all challenges
 * which was refactored in listing-improve
 */
function onGetAllActiveChallengesInit(state, { payload }) {
  return { ...state, loadingActiveChallengesUUID: payload };
}
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

/**
 * Called when 1st page of ative challenges is loaded from `/challenges` api
 * @param {*} state
 * @param {*} param1
 */
function onGetActiveChallengesDone(state, { error, payload }) {
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

  /* Fetching 0 page of active challenges also drops any active challenges
   * loaded to the state before. */
  const filter = state.lastRequestedPageOfActiveChallenges
    ? item => !ids.has(item.id)
    : item => !ids.has(item.id) && item.status !== 'ACTIVE';

  const challenges = state.challenges
    .filter(filter)
    .concat(loaded);

  return {
    ...state,
    challenges,
    lastUpdateOfActiveChallenges: Date.now(),
    loadingActiveChallengesUUID: '',
    meta: payload.meta,
  };
}

/**
 * Called when loading of 1st page of active challenges is started
 * @param {*} state
 * @param {*} param1
 */
function onGetActiveChallengesInit(state, { payload }) {
  return {
    ...state,
    loadingActiveChallengesUUID: payload.uuid,
    lastRequestedPageOfActiveChallenges: payload.page,
  };
}
function onGetRestActiveChallengesInit(state, { payload }) {
  return {
    ...state,
    loadingRestActiveChallengesUUID: payload.uuid,
  };
}

/**
 * Called when all challenges are loaded
 * @param {*} state
 * @param {*} param1
 */
function onGetRestActiveChallengesDone(state, { error, payload }) {
  if (error) {
    logger.error(payload);
    return state;
  }
  const { uuid, challenges: loaded } = payload;
  if (uuid !== state.loadingRestActiveChallengesUUID) return state;

  /* Once all active challenges are fetched from the API, we remove from the
   * store any active challenges stored there previously, and also any
   * challenges with IDs matching any challenges loaded now as active. */
  const ids = new Set();
  loaded.forEach(item => ids.add(item.id));

  /* Fetching 0 page of active challenges also drops any active challenges
   * loaded to the state before. */
  const filter = item => !ids.has(item.id);

  const challenges = state.challenges
    .filter(filter)
    .concat(loaded);

  return {
    ...state,
    challenges,
    allActiveChallengesLoaded: true,
    lastUpdateOfActiveChallenges: Date.now(),
    lastRequestedPageOfActiveChallenges: -1,
    loadingRestActiveChallengesUUID: '',
  };
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
    const ff = Filter.getFilterFunction(frontFilter);
    keepPastPlaceholders = challenges.filter(ff).length - state.challenges.filter(ff).length < 10;
  }

  return {
    ...state,
    allPastChallengesLoaded: loaded.length === 0,
    challenges,
    keepPastPlaceholders,
    loadingPastChallengesUUID: '',
  };
}

function onGetMyChallengesInit(state, action) {
  const { frontFilter, uuid } = action.payload;
  const tracks = frontFilter && frontFilter.tracks;
  if (tracks && _.isEmpty(tracks)) {
    return {
      ...state,
      allMyChallengesLoaded: true,
      loadingMyChallengesUUID: '',
    };
  }

  return {
    ...state,
    loadingMyChallengesUUID: uuid,
  };
}

function onGetMyChallengesDone(state, { error, payload }) {
  if (error) {
    logger.error(payload);
    return state;
  }
  const { uuid, challenges } = payload;
  if (uuid !== state.loadingMyChallengesUUID) return state;

  return {
    ...state,
    allMyChallengesLoaded: true,
    myChallenges: challenges,
    keepMyPlaceholders: false,
    loadingMyChallengesUUID: '',
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
    allPastChallengesLoaded: false,
    lastRequestedPageOfPastChallenges: -1,
    allMyChallengesLoaded: false,
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
    allPastChallengesLoaded: false,
    lastRequestedPageOfPastChallenges: -1,
    allMyChallengesLoaded: false,
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
      allActiveChallengesLoaded: false,
      allPastChallengesLoaded: false,
      allMyChallengesLoaded: false,
      allReviewOpportunitiesLoaded: false,
      challenges: [],
      lastRequestedPageOfActiveChallenges: -1,
      lastRequestedPageOfPastChallenges: -1,
      lastRequestedPageOfReviewOpportunities: -1,
      lastUpdateOfActiveChallenges: 0,
      loadingActiveChallengesUUID: '',
      loadingRestActiveChallengesUUID: '',
      loadingPastChallengesUUID: '',
      loadingMyChallengesUUID: '',
      loadingReviewOpportunitiesUUID: '',
      reviewOpportunities: [],
      meta: {
        allChallengesCount: 0,
        myChallengesCount: 0,
        ongoingChallengesCount: 0,
        openChallengesCount: 0,
        totalCount: 0,
      },
    }),

    [a.expandTag]: (state, { payload }) => ({
      ...state,
      expandedTags: [...state.expandedTags, payload],
    }),

    [a.getMyChallengesInit]: onGetMyChallengesInit,
    [a.getMyChallengesDone]: onGetMyChallengesDone,

    [a.getAllActiveChallengesInit]: onGetAllActiveChallengesInit,
    [a.getAllActiveChallengesDone]: onGetAllActiveChallengesDone,

    [a.getActiveChallengesInit]: onGetActiveChallengesInit,
    [a.getActiveChallengesDone]: onGetActiveChallengesDone,

    [a.getRestActiveChallengesInit]: onGetRestActiveChallengesInit,
    [a.getRestActiveChallengesDone]: onGetRestActiveChallengesDone,

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
    allActiveChallengesLoaded: false,
    allPastChallengesLoaded: false,
    allMyChallengesLoaded: false,
    allReviewOpportunitiesLoaded: false,

    challenges: [],
    myChallenges: [],
    challengeSubtracks: [],
    challengeSubtracksMap: {},
    challengeTags: [],

    expandedTags: [],

    filter: {},

    keepPastPlaceholders: false,
    keepMyPlaceholders: false,

    lastRequestedPageOfActiveChallenges: -1,
    lastRequestedPageOfPastChallenges: -1,
    lastRequestedPageOfReviewOpportunities: -1,
    lastUpdateOfActiveChallenges: 0,

    loadingActiveChallengesUUID: '',
    loadingRestActiveChallengesUUID: '',
    loadingPastChallengesUUID: '',
    loadingMyChallengesUUID: '',
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

    meta: {
      allChallengesCount: 0,
      myChallengesCount: 0,
      ongoingChallengesCount: 0,
      openChallengesCount: 0,
      totalCount: 0,
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
  if (req && req.url.match(/challenges(\/?$|\/?\?)/)) {
    let state = {};

    if (req.query.filter) {
      state = onSetFilter(state, { payload: req.query.filter });
    }
    state.selectedCommunityId = req.query.communityId;

    return redux.resolveReducers({
      sidebar: sidebarFactory(req),
    }).then(reducers => redux.combineReducers(create(state), { ...reducers, filterPanel }));
  }

  return redux.resolveReducers({
    sidebar: sidebarFactory(req),
  }).then(reducers => redux.combineReducers(create(), { ...reducers, filterPanel }));
}

/* Default reducer with empty initial state. */
export default redux.combineReducers(create(), { filterPanel, sidebar });
