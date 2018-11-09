/**
 * Use this container to load content from Contentful CMS in a developer-
 * friendly way.
 */

import _ from 'lodash';
import actions from 'actions/contentful';
import forge from 'node-forge';
import PT from 'prop-types';
import React from 'react';
import shortId from 'shortid';
import qs from 'qs';
import SSR from 'utils/SSR';
import { connect } from 'react-redux';

const DEFAULT_MAXAGE = 5 * 60 * 1000;
const DEFAULT_REFRESH_MAXAGE = 1 * 60 * 1000;

/* Timeout for server-side rendering routine [ms]. */
const SSR_TIMEOUT = 3000; /* 3 seconds */

/**
 * Returns an array of all `a` elements not present in `b`.
 * @param {Array} a
 * @param {Array} b
 * @return {Array}
 */
function arrayDiff(a, b) {
  if (!b.length) return a;
  const set = new Set(b);
  return a.filter(item => !set.has(item));
}

/**
 * Auxiliary function:
 *  - If `arg` is an array, returns that array;
 *  - If `arg` is falsy, returns a new empty array;
 *  - Otherwise returns a new array, having `arg` as its only element.
 */
function toArray(arg) {
  if (arg) return _.isArray(arg) ? arg : [arg];
  return [];
}

/**
 * Generates Md5 fingerprint of the specified query.
 * @param {Object|String} query
 * @return {String}
 */
function queryToMd5(query) {
  if (!query) return null;
  const md5 = forge.md.md5.create();
  md5.update(_.isObject(query) ? qs.stringify(query) : '');
  return md5.digest().toHex();
}

/**
 * Looks up for the specified content. Either returns all requested content,
 * or null, if any of the content is missing.
 * @param {Object} content An object with `items` and `queries` collections for
 *  the look up. Each collection should be an intance of `colleciton` store
 *  segment from `topcoder-react-utils` library.
 * @param {String|String[]} itemIds ID, or an array of IDs, of items to look
 *  for.
 * @param {Object|Object[]} query Query, or an array of queries, to look for.
 * @param {Number} minTimestamp The minimal timestamp of items and queries to
 *  take into account; i.e. any stored items / queries with timestamps older
 *  than this value will be ignored during the lookup.
 * @return {Object} `null` if any of the requested content is missing, or an
 *  object with two fields:
 *  - `items` {Object} - the map of content items (including those matched by
 *    the queries;
 *  - `matches` {Array} - array of query results.
 */
function findData(content, itemIds, queries, minTimestamp) {
  const res = { items: {}, matches: [] };
  let ids = toArray(itemIds);

  /* Lookup of query results, along with collection of items matched by these
   * queries. */
  if (queries) {
    const array = toArray(queries);
    for (let i = 0; i !== array.length; i += 1) {
      const slot = content.queries[queryToMd5(array[i])];
      if (!slot || !slot.item || slot.timestamp < minTimestamp) return null;
      ids = ids.concat(slot.item.items);
      res.matches.push(slot.item);
    }
  }

  /* Lookup of content items. */
  if (ids.length) {
    for (let i = 0; i !== ids.length; i += 1) {
      const slot = content.items[ids[i]];
      if (!slot || !slot.item || slot.timestamp < minTimestamp) return null;
      res.items[ids[i]] = slot.item;
    }
  }

  return res;
}

/**
 * Generates an object with requested data to pass into the rendering
 * function. In case any of the data are missing, it returns `undefined`.
 * @param {Object} props Props set to use.
 * @return {Object} In case all requested data are present, it is an object
 *  with the following structure:
 *  - assets {Object}
 *    - items: {Object}
 *    - matches: {Array}
 *  - entries {Object}
 *    - items: {Object}
 *    - matches: {Array}
 */
function findRequestedData(props) {
  const {
    assetIds,
    assetQueries,
    assets,
    entries,
    entryIds,
    entryQueries,
    maxage,
    preview,
  } = props;
  const minTimestamp = Date.now() - maxage;
  const res = { preview: Boolean(preview) };

  res.assets = findData(assets, assetIds, assetQueries, minTimestamp);
  if (!res.assets) return null;

  res.entries = findData(entries, entryIds, entryQueries, minTimestamp);
  if (!res.entries) return null;

  return res;
}

class ContentfulLoader extends React.Component {
  componentDidMount() {
    const {
      assetIds,
      assetQueries,
      entryIds,
      entryQueries,
      refreshMaxage,
    } = this.props;
    const timeLimit = Date.now() - refreshMaxage;
    const a = this.loadContentOnMount(assetIds, 'assets', timeLimit);
    const b = this.loadContentOnMount(entryIds, 'entries', timeLimit);
    const c = this.loadQueriesOnMount(assetQueries, 'assets', timeLimit);
    const d = this.loadQueriesOnMount(entryQueries, 'entries', timeLimit);
    return Promise.all([...a, ...b, ...c, ...d])
      .then(() => new Promise(resolve => setTimeout(() => resolve(), 100)));
  }

  componentDidUpdate(prev) {
    const {
      assetIds,
      assetQueries,
      entryIds,
      entryQueries,
      refreshMaxage,
    } = this.props;

    const timeLimit = Date.now() - refreshMaxage;

    this.updateContent(assetIds, prev.assetIds, 'assets', timeLimit, prev);
    this.updateContent(entryIds, prev.entryIds, 'entries', timeLimit, prev);
    this.updateQueries(
      assetQueries, prev.assetQueries, 'assets', timeLimit,
      prev,
    );
    this.updateQueries(
      entryQueries, prev.entryQueries, 'entries', timeLimit,
      prev,
    );
  }

  componentWillUnmount() {
    const {
      assetIds,
      assetQueries,
      entryIds,
      entryQueries,
      freeContent,
      freeQuery,
      preview,
    } = this.props;

    if (assetIds) freeContent(toArray(assetIds), 'assets', preview);
    if (entryIds) freeContent(toArray(entryIds), 'entries', preview);

    if (assetQueries) {
      const ids = toArray(assetQueries).map(query => queryToMd5(query));
      ids.forEach(id => freeQuery(id, 'assets', preview));
    }

    if (entryQueries) {
      const ids = toArray(entryQueries).map(query => queryToMd5(query));
      ids.forEach(id => freeQuery(id, 'entries', preview));
    }
  }

  /**
   * (Re-)loads assets or entries with specified IDs.
   * @param {String[]} ids
   * @param {String} target `assets` or `entries`.
   * @param {Number} timeLimit
   */
  loadContent(ids, target, timeLimit) {
    const { getContent, preview, [target]: { items } } = this.props;
    const p = [];
    ids.forEach((id) => {
      const slot = items[id];
      if (!slot || (!slot.loadingOperationId && slot.timestamp < timeLimit)) {
        p.push(getContent(id, target, preview));
      }
    });
    return p;
  }

  /**
   * Initial booking of content (on mount).
   * @param {String|String[]} contentIds Optional. ID, or an array of IDs.
   * @param {String} target `assets` or `entries`
   * @param {Number} timeLimit
   */
  loadContentOnMount(contentIds, target, timeLimit) {
    if (!contentIds) return [];
    const ids = toArray(contentIds);
    const { bookContent, preview } = this.props;
    bookContent(ids, target, preview);
    return this.loadContent(ids, target, timeLimit);
  }

  loadQueries(ids, contentQueries, target, timeLimit) {
    const { queryContent, preview, [target]: { queries } } = this.props;
    const p = [];
    ids.forEach((id, index) => {
      const slot = queries[id];
      if (!slot || (!slot.loadingOperationId && slot.timestamp < timeLimit)) {
        p.push(queryContent(id, contentQueries[index], target, preview));
      }
    });
    return p;
  }

  loadQueriesOnMount(contentQueries, target, timeLimit) {
    if (!contentQueries) return [];
    const queries = toArray(contentQueries);
    const ids = queries.map(q => queryToMd5(q));
    const { bookQuery, preview } = this.props;
    ids.forEach(id => bookQuery(id, target, preview));
    return this.loadQueries(ids, queries, target, timeLimit);
  }

  updateContent(ids, prevIds, target, timeLimit, prev) {
    if (!ids && !prevIds) return;
    const old = toArray(prevIds);
    const neu = toArray(ids);
    let added;
    let gone;
    const {
      bookContent,
      freeContent,
      getContent,
      preview,
      [target]: { items },
    } = this.props;
    if (preview !== prev.preview) {
      added = neu;
      gone = old;
    } else {
      added = arrayDiff(neu, old);
      gone = arrayDiff(old, neu);
    }
    if (gone.length) freeContent(gone, target, prev.preview);
    if (added.length) {
      bookContent(added, target, preview);
      added.forEach((id) => {
        const slot = items[id];
        if (!slot || (!slot.loadingOperationId && slot.timestamp < timeLimit)) {
          getContent(id, target, preview);
        }
      });
    }
  }

  updateQueries(contentQueries, prevQueries, target, timeLimit, prev) {
    if (!contentQueries && !prevQueries) return;
    const old = toArray(prevQueries);
    const neu = toArray(contentQueries);
    const oldIds = old.map(q => queryToMd5(q));
    const neuIds = old.map(q => queryToMd5(q));
    let added;
    let gone;
    let addedIds;
    let goneIds;
    const {
      bookQuery,
      freeQuery,
      queryContent,
      preview,
      [target]: { queries },
    } = this.props;
    if (preview !== prev.preview) {
      added = neu;
      gone = old;
      addedIds = neuIds;
      goneIds = oldIds;
    } else {
      addedIds = arrayDiff(neuIds, oldIds);
      goneIds = arrayDiff(oldIds, neuIds);
      added = [];
      if (addedIds.length) {
        const neuMap = _.zipObject(neuIds, neu);
        addedIds.forEach(id => added.push(neuMap[id]));
      }
      gone = [];
      if (goneIds.length) {
        const oldMap = _.zipObject(oldIds, old);
        goneIds.forEach(id => gone.push(oldMap[id]));
      }
    }
    if (gone.length) {
      goneIds.forEach(id => freeQuery(id, target, prev.preview));
    }
    if (added.length) {
      addedIds.forEach((id, index) => {
        bookQuery(id, target, preview);
        const slot = queries[id];
        if (!slot || (!slot.loadingOperationId && slot.timestamp < timeLimit)) {
          queryContent(id, added[index], target, preview);
        }
      });
    }
  }

  render() {
    const { render, renderPlaceholder: Placeholder } = this.props;
    const data = findRequestedData(this.props);

    /* Some of the required data still pending to load: render a placeholder,
     * or nothing. */
    if (!data) {
      return _.isFunction(Placeholder) ? <Placeholder /> : Placeholder;
    }

    /* Bingo: render the child component with requested data. */
    return render(data);
  }
}

ContentfulLoader.defaultProps = {
  assetIds: null,
  assetQueries: null,
  entryIds: null,
  entryQueries: null,
  maxage: DEFAULT_MAXAGE,
  preview: false,
  refreshMaxage: DEFAULT_REFRESH_MAXAGE,
  renderPlaceholder: null,
};

const QUERY_TYPE = PT.oneOfType([PT.bool, PT.object, PT.arrayOf(PT.object)]);
const STRING_OR_STRING_ARRAY = PT.oneOfType([PT.string, PT.arrayOf(PT.string)]);

ContentfulLoader.propTypes = {
  assets: PT.shape().isRequired,
  assetIds: STRING_OR_STRING_ARRAY,
  assetQueries: QUERY_TYPE,
  bookContent: PT.func.isRequired,
  bookQuery: PT.func.isRequired,
  entries: PT.shape().isRequired,
  entryIds: STRING_OR_STRING_ARRAY,
  entryQueries: QUERY_TYPE,
  freeContent: PT.func.isRequired,
  freeQuery: PT.func.isRequired,
  getContent: PT.func.isRequired,
  maxage: PT.number,
  preview: PT.bool,
  queryContent: PT.func.isRequired,
  refreshMaxage: PT.number,
  render: PT.func.isRequired,
  renderPlaceholder: PT.oneOfType([PT.func, PT.object]),
};

function mapStateToProps(state, ownProps) {
  const st = state.contentful;
  return ownProps.preview ? st.preview : st.published;
}

function mapDispatchToProps(dispatch) {
  const a = actions.contentful;
  return {
    bookContent: (ids, target, preview) => dispatch(a.bookContent(ids, target, preview)),
    bookQuery: (id, target, preview) => dispatch(a.bookQuery(id, target, preview)),
    freeContent: (ids, target, preview) => dispatch(a.freeContent(ids, target, preview)),
    freeQuery: (id, target, preview) => dispatch(a.freeQuery(id, target, preview)),
    getContent: (contentId, target, preview) => {
      const uuid = shortId();
      dispatch(a.getContentInit(uuid, contentId, target, preview));
      const action = a.getContentDone(uuid, contentId, target, preview);
      dispatch(action);
      return action.payload;
    },
    queryContent: (queryId, query, target, preview) => {
      const uuid = shortId();
      const q = _.isObject(query) ? query : null;
      dispatch(a.queryContentInit(uuid, queryId, target, preview));
      const action = a.queryContentDone(uuid, queryId, target, q, preview);
      dispatch(action);
      return action.payload;
    },
  };
}

const ConnectedContentfulLoader = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContentfulLoader);

function checkStore(store, props) {
  const p = {
    ...mapStateToProps(store.getState(), props),
    ...props,
  };
  return Boolean(findRequestedData(p));
}

async function updateStore(store, props) {
  const p = {
    ...mapStateToProps(store.getState(), props),
    ...mapDispatchToProps(action => store.dispatch(action)),
    ...props,
  };
  const Loader = new ContentfulLoader(p);
  await Loader.componentDidMount();
  if (!checkStore(store, props)) {
    await new Promise((resolve) => {
      let id = setTimeout(() => {
        id = null;
        resolve();
      }, SSR_TIMEOUT);
      store.subscribe(() => {
        if (!id) return;
        if (checkStore(store, props)) {
          clearTimeout(id);
          resolve();
        }
      });
    });
  }
}

export default SSR(checkStore, updateStore)(ConnectedContentfulLoader);
