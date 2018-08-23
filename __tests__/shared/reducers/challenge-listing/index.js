import { mock } from 'topcoder-react-lib';

const { mockAction } = mock;

jest.mock('utils/url', () => ({
  updateQuery: () => {},
}));
const defaultReducer = require('reducers/challenge-listing').default;

const mockActions = {
  dropChallenges: () => mockAction('CHALLENGE_LISTING/DROP_CHALLENGES'),
  getAllActiveChallengesInit: uuid => mockAction(
    'CHALLENGE_LISTING/GET_ALL_ACTIVE_CHALLENGES_INIT',
    uuid,
  ),
  getAllActiveChallengesDone: payload => mockAction(
    'CHALLENGE_LISTING/GET_ALL_ACTIVE_CHALLENGES_DONE',
    payload,
  ),
  getChallengeSubtracksInit: () => mockAction('CHALLENGE_LISTING/GET_CHALLENGE_SUBTRACKS_INIT'),
  getChallengeSubtracksDone: (payload, error) => mockAction(
    'CHALLENGE_LISTING/GET_CHALLENGE_SUBTRACKS_DONE',
    payload,
    error,
  ),
  getChallengeTagsInit: () => mockAction('CHALLENGE_LISTING/GET_CHALLENGE_TAGS_INIT'),
  getChallengeTagsDone: (payload, error) => mockAction(
    'CHALLENGE_LISTING/GET_CHALLENGE_TAGS_DONE',
    payload,
    error,
  ),
  getCommunityFilters: (payload, error) => mockAction(
    'CHALLENGE_LISTING/GET_COMMUNITY_FILTERS',
    payload,
    error,
  ),
  getDraftChallengesInit: (payload, error) => mockAction(
    'CHALLENGE_LISTING/GET_DRAFT_CHALLENGES_INIT',
    payload,
    error,
  ),
  getDraftChallengesDone: (payload, error) => mockAction(
    'CHALLENGE_LISTING/GET_DRAFT_CHALLENGES_DONE',
    payload,
    error,
  ),
  getPastChallengesInit: (payload, error) => mockAction(
    'CHALLENGE_LISTING/GET_PAST_CHALLENGES_INIT',
    payload,
    error,
  ),
  getPastChallengesDone: (payload, error) => mockAction(
    'CHALLENGE_LISTING/GET_PAST_CHALLENGES_DONE',
    payload,
    error,
  ),
  selectCommunity: (payload, error) => mockAction(
    'CHALLENGE_LISTING/SELECT_COMMUNITY',
    payload,
    error,
  ),
  setFilter: (payload, error) => mockAction(
    'CHALLENGE_LISTING/SET_FILTER',
    payload,
    error,
  ),
  setSort: (payload, error) => mockAction(
    'CHALLENGE_LISTING/SET_SORT',
    payload,
    error,
  ),
};

let expectedState = {
  allDraftChallengesLoaded: false,
  allPastChallengesLoaded: false,
  allReviewOpportunitiesLoaded: false,

  challenges: [],
  challengeSubtracks: [],
  challengeSubtracksMap: {},
  challengeTags: [],

  expandedTags: [],

  filter: {},

  filterPanel: {
    expanded: false,
    searchText: '',
    trackModalShown: false,
  },

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
  sidebar: {
    activeBucket: 'all',
    activeSavedFilter: 0,
    editSavedFiltersMode: false,
    isSavingFilter: false,
    savedFilters: [],
  },

  srms: {
    data: [],
    loadingUuid: '',
    timestamp: 0,
  },
};

function testReducer(reducer) {
  let state;

  test('creates expected initial state', () => {
    state = reducer(undefined, {});
    expect(state).toEqual(expectedState);
  });

  test('properly handles dropChallenges', () => {
    state = reducer(state, mockActions.dropChallenges()());
    expectedState = {
      ...expectedState,
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
    };

    expect(state).toEqual(expectedState);
  });

  test('properly handles getAllActiveChallengesInit', () => {
    state = reducer(state, mockActions.getAllActiveChallengesInit('uuid')());
    expectedState = {
      ...expectedState,
      loadingActiveChallengesUUID: 'uuid',
    };

    expect(state).toEqual(expectedState);
  });

  test('properly handles getAllActiveChallengesDone', () => {
    state = reducer(state, mockActions.getAllActiveChallengesDone({ uuid: '' })());
    expectedState = {
      ...expectedState,
    };
    expect(state).toEqual(expectedState);
  });

  test('properly handles getChallengeSubtracksInit', () => {
    state = reducer(state, mockActions.getChallengeSubtracksInit()());
    expectedState = {
      ...expectedState,
      loadingChallengeSubtracks: true,
    };
    expect(state).toEqual(expectedState);
  });

  test('properly handles getChallengeSubtracksDone', () => {
    state = reducer(state, mockActions.getChallengeSubtracksDone([])());
    expectedState = {
      ...expectedState,
      loadingChallengeSubtracks: false,
    };
    expect(state).toEqual(expectedState);
  });

  test('properly handles getChallengeTagsInit', () => {
    state = reducer(state, mockActions.getChallengeTagsInit()());
    expectedState = {
      ...expectedState,
      loadingChallengeTags: true,
    };
    expect(state).toEqual(expectedState);
  });

  test('properly handles getChallengeTagsDone', () => {
    state = reducer(state, mockActions.getChallengeTagsDone([])());
    expectedState = {
      ...expectedState,
      loadingChallengeTags: false,
    };
    expect(state).toEqual(expectedState);
  });

  test('properly handles getCommunityFilters', () => {
    state = reducer(state, mockActions.getCommunityFilters([])());
    expect(state).toEqual(expectedState);
  });

  test('properly handles getDraftChallengesInit', () => {
    state = reducer(state, mockActions.getDraftChallengesInit({ uuid: 'uuid', page: '1' })());
    expectedState = {
      ...expectedState,
      lastRequestedPageOfDraftChallenges: '1',
      loadingDraftChallengesUUID: 'uuid',
    };
    expect(state).toEqual(expectedState);
  });

  test('properly handles getDraftChallengesDone', () => {
    state = reducer(state, mockActions.getDraftChallengesDone({ uuid: 'uuid', challenges: [] })());
    expectedState = {
      ...expectedState,
      allDraftChallengesLoaded: true,
      loadingDraftChallengesUUID: '',
    };
    expect(state).toEqual(expectedState);
  });

  test('properly handles getPastChallengesInit', () => {
    state = reducer(state, mockActions.getPastChallengesInit({ uuid: 'uuid', page: '1' })());
    expectedState = {
      ...expectedState,
      lastRequestedPageOfPastChallenges: '1',
      loadingPastChallengesUUID: 'uuid',
    };
    expect(state).toEqual(expectedState);
  });

  test('properly handles getPastChallengesDone', () => {
    state = reducer(state, mockActions.getPastChallengesDone({ uuid: 'uuid', challenges: [] })());
    expectedState = {
      ...expectedState,
      allPastChallengesLoaded: true,
      loadingPastChallengesUUID: '',
    };
    expect(state).toEqual(expectedState);
  });

  test('properly handles selectCommunity', () => {
    state = reducer(state, mockActions.selectCommunity('communityId')());
    expectedState = {
      ...expectedState,
      selectedCommunityId: 'communityId',
      allDraftChallengesLoaded: false,
      allPastChallengesLoaded: false,
      lastRequestedPageOfDraftChallenges: -1,
      lastRequestedPageOfPastChallenges: -1,
    };
    expect(state).toEqual(expectedState);
  });

  test('properly handles setFilter', () => {
    state = reducer(state, mockActions.setFilter('filter')());
    expectedState = {
      ...expectedState,
      filter: 'filter',
      allDraftChallengesLoaded: false,
      allPastChallengesLoaded: false,
      lastRequestedPageOfDraftChallenges: -1,
      lastRequestedPageOfPastChallenges: -1,
    };
    expect(state).toEqual(expectedState);
  });

  test('properly handles setSort', () => {
    state = reducer(state, mockActions.setSort({ bucket: 'bucket', sort: 'sort' })());
    expectedState = {
      ...expectedState,
      sorts: {
        ...expectedState.sorts,
        bucket: 'sort',
      },
    };
    expect(state).toEqual(expectedState);
  });
}

describe('default reducer', () => testReducer(defaultReducer));
