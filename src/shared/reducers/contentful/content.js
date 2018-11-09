import _ from 'lodash';
import actions from 'actions/contentful';

import {
  actions as truActions,
  reducers as truReducers,
  redux,
} from 'topcoder-react-utils';

const CACHE_MAXAGE = 5 * 60 * 1000;

const collectionActions = truActions.collection;
const reduceCollection = truReducers.collection;

/**
 * Cleans state.
 * @param {Object} state
 * @param {Number} now
 * @return {State} New state.
 */
function onCleanState(state, { payload }) {
  const a = collectionActions.clean(payload - CACHE_MAXAGE);
  return {
    ...state,
    items: reduceCollection(state.items, a),
    queries: reduceCollection(state.queries, a),
  };
}

/**
 * Adds items to the state.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onAddItems(state, action) {
  return { ...state, items: reduceCollection(state.items, action) };
}

/**
 * Increment reference counters for the specified content items.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onBookContent(state, action) {
  const a = collectionActions.bookItems(action.payload.ids);
  return { ...state, items: reduceCollection(state.items, a) };
}

/**
 * Decreases reference counters for the specified content items.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onFreeContent(state, action) {
  const a = collectionActions.freeItems(action.payload.ids);
  return { ...state, items: reduceCollection(state.items, a) };
}

/**
 * Writes to the store beginning of content loading.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetContentInit(state, action) {
  const { operationId, contentId } = action.payload;
  const a = collectionActions.loadItemInit(operationId, contentId);
  return { ...state, items: reduceCollection(state.items, a) };
}

/**
 * Receives loaded content.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetContentDone(state, action) {
  const {
    content,
    contentId,
    operationId,
  } = action.payload;

  const res = _.clone(state);
  const a = collectionActions.loadItemDone(operationId, contentId, content);
  res.items = reduceCollection(res.items, a);
  return res;
}

/**
 * Writes to the store beginning of content quering.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onQueryContentInit(state, action) {
  const { operationId, queryId } = action.payload;
  const a = collectionActions.loadItemInit(operationId, queryId);
  return { ...state, queries: reduceCollection(state.queries, a) };
}

/**
 * Receives query result.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onQueryContentDone(state, action) {
  const {
    data,
    operationId,
    queryId,
  } = action.payload;

  const res = _.clone(state);

  /* Adds matched items to items collection. */
  const d = _.omit(data, 'includes');
  let a = collectionActions.addItems(_.keyBy(data.items, i => i.sys.id));
  res.items = reduceCollection(res.items, a);

  /* Adds query itself to the quries collection. */
  d.items = d.items.map(i => i.sys.id);
  a = collectionActions.loadItemDone(operationId, queryId, d);
  res.queries = reduceCollection(res.queries, a);

  /* In case the resulting query match is different from the one stored in the
   * old state, we should correctly update reference counters of the newly
   * matched items, and of the items not matched anymore. */

  const q = state.queries[queryId];

  let added = [];
  const gone = [];
  if (q.item) {
    const neu = new Set(d.items);
    const old = new Set(q.item.items);
    d.items.forEach((id) => {
      if (!old.has(id)) added.push(id);
    });
    q.item.items.forEach((id) => {
      if (!neu.has(id)) gone.push(id);
    });
  } else added = d.items;

  if (added.length) {
    a = collectionActions.bookItems(added, q.numRefs);
    res.items = reduceCollection(res.items, a);
  }

  if (gone.length) {
    a = collectionActions.freeItems(gone, q.numRefs);
    res.items = reduceCollection(res.items, a);
  }

  return res;
}

/**
 * Updates reference counters for the specified query, and for all content items
 * matched by the query (if the query is resolved already).
 * @param {Object} state
 * @param {String} id
 * @param {Boolean} increment
 * @return {Object} New state.
 */
function updateQueryRefCounters(state, id, increment) {
  let a = collectionActions;
  a = increment ? a.bookItems : a.freeItems;
  const res = { ...state, queries: reduceCollection(state.queries, a(id)) };

  const ids = _.get(state.queries[id], 'item.items');
  if (ids && ids.length) res.items = reduceCollection(res.items, a(ids));
  return res;
}

function create(initialState = {}) {
  const a = actions.contentful;
  return redux.handleActions({
    [truActions.collection.addItems]: onAddItems,
    [a.bookContent]: onBookContent,
    [a.bookQuery]: (s, act) => updateQueryRefCounters(s, act.payload.id, true),
    [a.cleanState]: onCleanState,
    [a.freeContent]: onFreeContent,
    [a.freeQuery]: (s, act) => updateQueryRefCounters(s, act.payload.id, false),
    [a.getContentInit]: onGetContentInit,
    [a.getContentDone]: onGetContentDone,
    [a.queryContentInit]: onQueryContentInit,
    [a.queryContentDone]: onQueryContentDone,
  }, _.defaults(initialState, {
    items: reduceCollection(undefined, { type: '@@INIT' }),
    queries: reduceCollection(undefined, { type: '@@INIT' }),
  }));
}

export default create();
