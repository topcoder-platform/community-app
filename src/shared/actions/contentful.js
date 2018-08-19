import { getService } from 'services/contentful';
import { redux } from 'topcoder-react-utils';

const ERRMSG_UNKNOWN_TARGET = 'Unknown action target';

export const TARGETS = {
  ASSETS: 'assets',
  ENTRIES: 'entries',
};

function bookContent(ids, target, preview, spaceName, environment) {
  return {
    ids, preview, spaceName, environment, target,
  };
}

function bookQuery(id, target, preview, spaceName, environment) {
  return {
    id, preview, spaceName, environment, target,
  };
}

function cleanState() {
  return Date.now();
}

function freeContent(ids, target, preview, spaceName, environment) {
  return {
    ids, preview, spaceName, environment, target,
  };
}

function freeQuery(id, target, preview, spaceName, environment) {
  return {
    id, preview, spaceName, environment, target,
  };
}

/**
 * @param {String} operationId
 * @param {String} contentId
 * @param {String} contentType One of CONTENT_TYPES values.
 * @param {Boolean} preview Optional.
 * @param {String} spaceName Optional.
 * @param {String} environment Optional.
 */
function getContentInit(operationId, contentId, target, preview, spaceName, environment) {
  return {
    contentId,
    operationId,
    preview,
    spaceName,
    environment,
    target,
  };
}

/**
 * @param {String} operationId
 * @param {String} contentId
 * @param {String} target
 * @param {Boolean} preview
 * @param {String} spaceName
 * @param {String} environment
 * @return {Object}
 */
async function getContentDone(operationId, contentId, target, preview, spaceName, environment) {
  const service = getService({ preview, spaceName, environment });
  let content;
  switch (target) {
    case TARGETS.ASSETS: content = await service.getAsset(contentId); break;
    case TARGETS.ENTRIES: content = await service.getEntry(contentId); break;
    default: throw new Error(ERRMSG_UNKNOWN_TARGET);
  }

  return {
    content,
    contentId,
    operationId,
    preview,
    spaceName,
    environment,
    target,
  };
}

function queryContentInit(operationId, queryId, target, preview, spaceName, environment) {
  return {
    operationId,
    preview,
    spaceName,
    environment,
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
 * @param {String} spaceName Optional.
 * @param {String} environment Optional.
 */
async function queryContentDone(operationId, queryId, target,
  query, preview, spaceName, environment) {
  const service = getService({ preview, spaceName, environment });
  let data;
  switch (target) {
    case TARGETS.ASSETS: data = await service.queryAssets(query); break;
    case TARGETS.ENTRIES: data = await service.queryEntries(query); break;
    default: throw new Error(ERRMSG_UNKNOWN_TARGET);
  }

  return {
    data,
    operationId,
    preview,
    spaceName,
    environment,
    queryId,
    target,
  };
}

export default redux.createActions({
  CONTENTFUL: {
    BOOK_CONTENT: bookContent,
    BOOK_QUERY: bookQuery,
    CLEAN_STATE: cleanState,
    FREE_CONTENT: freeContent,
    FREE_QUERY: freeQuery,
    GET_CONTENT_INIT: getContentInit,
    GET_CONTENT_DONE: getContentDone,
    QUERY_CONTENT_INIT: queryContentInit,
    QUERY_CONTENT_DONE: queryContentDone,
  },
});
