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
import { connect } from 'react-redux';

const DEFAULT_MAXAGE = 5 * 60 * 1000;
const DEFAULT_REFRESH_MAXAGE = 1 * 60 * 1000;

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
 * Finds required data, and returns either them, or `undefined` if any of the
 * requested data are missing.
 * @param {Object} content
 * @param {String|String[]} ids
 * @param {Object} query
 * @param {Number} minTimestamp
 * @return {Object}
 */
function findData(content, ids, query, minTimestamp) {
  let aux;
  const res = { items: {}, match: null };

  /* Finds query result. */
  if (query) {
    const q = content.queries[queryToMd5(query)];
    /* Fail: the query result is not known, or too outdated. */
    if (!q || !q.item || q.timestamp < minTimestamp) return null;
    aux = q.item.items;
    res.match = q.item;
  }

  /* Merges explicitely requetsed content IDs into IDs matched by the query,
   * taking into account that any or both of them might be absent. */
  if (ids) {
    if (aux) {
      if (_.isArray(ids)) aux = aux.concat(ids);
      else aux.push(ids);
    } else aux = _.isArray(ids) ? ids : [ids];
  }

  /* If there are no content IDs to look for - returns. */
  if (!aux || !aux.length) return res;

  /* Otherwise - attempts to find all required content objects. */
  for (let i = 0; i !== aux.length; i += 1) {
    const id = aux[i];
    const it = content.items[id];
    /* Fail: some of the required items is not known, or too outdated. */
    if (!it || !it.item || it.timestamp < minTimestamp) return null;
    res.items[id] = it;
  }

  /* Success. */
  return res;
}

/**
 * This is similar to `findData(..)` but intended for usage in loading /
 * reloading operations, where we need to find slots (wrappers) where info on
 * all requested content and/or query is stored.
 * @param {Object} content
 * @param {String|String[]} ids
 * @param {Object} query
 * @param {Number} minTimestamp
 * @param {Number} minReloadTimestamp
 * @return {Object}
 */
function findDataSlots(content, ids, query) {
  const res = { items: [], match: null };
  res.queryId = queryToMd5(query);

  /* Finds query result. */
  if (query) res.match = content.queries[res.queryId];

  if (!ids) return res;

  res.itemIds = _.isArray(ids) ? ids : [ids];
  res.itemIds.forEach((id) => {
    res.items.push(content.items[id]);
  });

  return res;
}

class ContentfulLoader extends React.Component {
  componentDidMount() {
    const {
      assetQuery,
      bookContent,
      bookQuery,
      entryQuery,
      getContent,
      preview,
      queryContent,
      refreshMaxage,
    } = this.props;
    const d = this.findDataSlots();
    const minTimestamp = Date.now() - refreshMaxage;

    console.log(d);

    /* Books the content in the store. */
    const assetIds = d.assets.itemIds;
    const entryIds = d.entries.itemIds;
    if (assetIds && assetIds.length) bookContent(assetIds, 'assets', preview);
    if (entryIds && entryIds.length) bookContent(entryIds, 'entries', preview);
    if (d.assets.queryId) bookQuery(d.assets.queryId, 'assets', preview);
    if (d.entries.queryId) bookQuery(d.entries.queryId, 'entries', preview);

    /* Loading. */
    const assetsMatch = d.assets.match;
    if (assetsMatch) {
      if (!assetsMatch.loadingOperationId
        && assetsMatch.timestamp < minTimestamp) {
        queryContent(assetQuery, 'assets', preview);
      }
    }
    const entriesMatch = d.entries.match;
    if (entriesMatch) {
      if (!entriesMatch.loadingOperationId
        && entriesMatch.timestamp < minTimestamp) {
        queryContent(entryQuery, 'entries', preview);
      }
    }
    d.assets.items.forEach((item) => {
      if (!item.loadingOperationId && item.timestamp < minTimestamp) {
        getContent(item.id, 'assets', preview);
      }
    });
    d.entries.items.forEach((item) => {
      if (!item.loadingOperationId && item.timestamp < minTimestamp) {
        getContent(item.id, 'entries', preview);
      }
    });
  }

  componentWillUnmount() {
    /* Free related content in the store. */
    const { freeContent, freeQuery, preview } = this.props;
    const d = this.findDataSlots();

    /* Books the content in the store. */
    const assetIds = d.assets.itemIds;
    const entryIds = d.entries.itemIds;
    if (assetIds && assetIds.length) freeContent(assetIds, 'assets', preview);
    if (entryIds && entryIds.length) freeContent(entryIds, 'entries', preview);
    if (d.assets.queryId) freeQuery(d.assets.queryId, 'assets', preview);
    if (d.entries.queryId) freeQuery(d.entries.queryId, 'entries', preview);
  }

  /**
   * Generates an object with requested data to pass into the rendering
   * function. In case any of the data are missing, it returns `undefined`.
   * @return {Object} In case all requested data are present, it is an object
   *  with the following fields:
   *  - assets {Object} - ID > object mapping of assets;
   *  - entries {Object} - ID > object mapping of entries;
   *  - assetsMatch {Object} - Optional. The result of asset query, if it was
   *    provided;
   *  - entriesMatch {Object} - Optional. The result of entries query, if it
   *    was requested.
   */
  findRequiredData() {
    /* TODO: The logic for assets and entries is the same here, thus all can
     * be done with a more generic method called twice. But, before we debug
     * the current implementation, further abstraction seems risky. */
    const {
      assetIds,
      assetQuery,
      assets,
      entries,
      entryIds,
      entryQuery,
      maxage,
    } = this.props;
    const minTimestamp = Date.now() - maxage;

    /* Finds assets and/or asset query result. */
    const a = findData(assets, assetIds, assetQuery, minTimestamp);
    if (!a) return null; /* Fail: something is not found or outdated. */

    /* Finds entries and/or entry query result. */
    const e = findData(entries, entryIds, entryQuery, minTimestamp);
    if (!e) return null; /* Fail: something is not found or outdated. */

    /* Bingo! */
    return {
      assets: a.items,
      entries: e.items,
      assetsMatch: a.match,
      entriesMatch: e.match,
    };
  }

  /**
   * Generates an object with all data on requested items we have
   * @return {Object}
   */
  findDataSlots() {
    const {
      assetIds,
      assetQuery,
      assets,
      entries,
      entryIds,
      entryQuery,
    } = this.props;
    const a = findDataSlots(assets, assetIds, assetQuery);
    const e = findDataSlots(entries, entryIds, entryQuery);
    return { assets: a, entries: e };
  }

  render() {
    const { render, renderPlaceholder } = this.props;
    const data = this.findRequiredData();

    /* Some of the required data still pending to load: render a placeholder,
     * or nothing. */
    if (!data) {
      return _.isFunction(renderPlaceholder) ? renderPlaceholder()
        : renderPlaceholder;
    }

    /* Bingo: render the child component with requested data. */
    return render(data);
  }
}

ContentfulLoader.defaultProps = {
  assetIds: null,
  assetQuery: null,
  entryIds: null,
  entryQuery: null,
  maxage: DEFAULT_MAXAGE,
  preview: false,
  refreshMaxage: DEFAULT_REFRESH_MAXAGE,
  renderPlaceholder: null,
};

const QUERY_TYPE = PT.oneOfType([PT.bool, PT.object]);
const STRING_OR_STRING_ARRAY = PT.oneOfType([PT.string, PT.arrayOf(PT.string)]);

ContentfulLoader.propTypes = {
  assets: PT.shape().isRequired,
  assetIds: STRING_OR_STRING_ARRAY,
  assetQuery: QUERY_TYPE,
  bookContent: PT.func.isRequired,
  bookQuery: PT.func.isRequired,
  entries: PT.shape().isRequired,
  entryIds: STRING_OR_STRING_ARRAY,
  entryQuery: QUERY_TYPE,
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
    bookContent: (ids, target, preview) =>
      dispatch(a.bookContent(ids, target, preview)),
    bookQuery: (id, target, preview) =>
      dispatch(a.bookQuery(id, target, preview)),
    freeContent: (ids, target, preview) =>
      dispatch(a.freeContent(ids, target, preview)),
    freeQuery: (id, target, preview) =>
      dispatch(a.freeQuery(id, target, preview)),
    getContent: (contentId, target, preview) => {
      const uuid = shortId();
      dispatch(a.getContentInit(uuid, contentId, target, preview));
      dispatch(a.getContentDone(uuid, contentId, target, preview));
    },
    /* TODO: It seems that at all points of the call we'll already know the
     * query ID (Md5 fingerprint), thus we should pass it in as argument,
     * rather than leaving it to this function to re-generate it. */
    queryContent: (query, target, preview) => {
      const uuid = shortId();
      const queryId = queryToMd5(query);
      dispatch(a.queryContentInit(uuid, queryId, target, preview));
      dispatch(a.queryContentDone(uuid, queryId, target, query, preview));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentfulLoader);
