import { getService } from 'services/contentful';
import { redux } from 'topcoder-react-utils';

const ERRMSG_UNKNOWN_TARGET = 'Unknown action target';

export const TARGETS = {
  ASSETS: 'assets',
  ENTRIES: 'entries',
};

function bookContent(ids, target, preview) {
  return { ids, preview, target };
}

function bookQuery(id, target, preview) {
  return { id, preview, target };
}

function freeContent(ids, target, preview) {
  return { ids, preview, target };
}

function freeQuery(id, target, preview) {
  return { id, preview, target };
}

/**
 * @param {String} operationId
 * @param {String} contentId
 * @param {String} contentType One of CONTENT_TYPES values.
 * @param {Boolean} preview Optional.
 */
function getContentInit(operationId, contentId, target, preview ) {
  return {
    contentId,
    operationId,
    preview,
    target,
  };
}

/**
 * @param {String} operationId
 * @param {String} contentId
 * @param {String} target
 * @param {Boolean} preview
 * @return {Object}
 */
async function getContentDone(operationId, contentId, target, preview) {
  let s = getService(preview);
  switch (target) {
    case TARGETS.ASSETS: s = s.getAsset; break;
    case TARGETS.ENTRIES: s = s.getEntry; break;
    default: throw new Error(ERRMSG_UNKNOWN_TARGET);
  }
  return {
    content: await s(contentId),
    contentId,
    operationId,
    preview,
    target,
    timestamp: Date.now(),
  };
}

function queryContentInit(operationId, queryId, target, preview) {
  return {
    operationId,
    preview,
    queryId,
    target,
  };
}

/**
 * @param {String} operationId
 * @param {String} queryId
 * @param {String} target
 * @param {Object|String} query
 * @param {Boolean} preview Optional.
 */
async function queryContentDone(operationId, queryId, target, query, preview) {
  let s = getService(preview);
  switch (target) {
    case TARGETS.ASSETS: s = s.queryAssets; break;
    case TARGETS.ENTRIES: s = s.queryEntries; break;
    default: throw new Error(ERRMSG_UNKNOWN_TARGET);
  }
  return {
    data: await s(query),
    operationId,
    preview,
    queryId,
    target,
    timestamp: Date.now(),
  };
}

export default redux.createActions({
  CONTENTFUL: {
    BOOK_CONTENT: bookContent,
    BOOK_QUERY: bookQuery,
    FREE_CONTENT: freeContent,
    FREE_QUERY: freeQuery,
    GET_CONTENT_INIT: getContentInit,
    GET_CONTENT_DONE: getContentDone,
    QUERY_CONTENT_INIT: queryContentInit,
    QUERY_CONTENT_DONE: queryContentDone,
  },
});
