import { handleActions } from 'redux-actions';
import actions from 'actions/engagements';

const initialState = {
  engagements: [],
  loadingEngagementsUUID: '',
  lastRequestedPage: -1,
  allEngagementsLoaded: false,
  filter: {
    status: 'open',
    skills: [],
    location: '',
    search: '',
  },
  meta: {
    totalCount: 0,
  },
};

function onGetEngagementsInit(state, { payload }) {
  return {
    ...state,
    loadingEngagementsUUID: payload.uuid,
    lastRequestedPage: payload.page,
    allEngagementsLoaded: payload.page === 0 ? false : state.allEngagementsLoaded,
  };
}

function onGetEngagementsDone(state, { error, payload }) {
  if (!payload || payload.uuid !== state.loadingEngagementsUUID) return state;

  if (error) {
    return {
      ...state,
      loadingEngagementsUUID: '',
    };
  }

  const page = typeof payload.page === 'number' ? payload.page : state.lastRequestedPage;
  const engagements = payload.engagements || [];
  const nextEngagements = page > 0
    ? state.engagements.concat(engagements)
    : engagements;
  const nextMeta = {
    ...state.meta,
    ...(payload.meta || {}),
  };
  const totalCount = typeof nextMeta.totalCount === 'number' ? nextMeta.totalCount : null;
  const allEngagementsLoaded = totalCount !== null
    ? nextEngagements.length >= totalCount
    : engagements.length === 0;

  return {
    ...state,
    engagements: nextEngagements,
    loadingEngagementsUUID: '',
    allEngagementsLoaded,
    meta: nextMeta,
  };
}

function onDropEngagements(state) {
  return {
    ...state,
    engagements: [],
    loadingEngagementsUUID: '',
    lastRequestedPage: -1,
    allEngagementsLoaded: false,
    meta: {
      totalCount: 0,
    },
  };
}

function onSetFilter(state, { payload }) {
  return {
    ...state,
    filter: {
      ...state.filter,
      ...payload,
    },
  };
}

function create(initial) {
  return handleActions({
    [actions.engagements.getEngagementsInit]: onGetEngagementsInit,
    [actions.engagements.getEngagementsDone]: onGetEngagementsDone,
    [actions.engagements.dropEngagements]: onDropEngagements,
    [actions.engagements.setFilter]: onSetFilter,
  }, initial || initialState);
}

export function factory() {
  return Promise.resolve(create());
}

export default create();
