import _ from 'lodash';
import { getService } from 'services/contentful';
import { config, redux } from 'topcoder-react-utils';
import { removeTrailingSlash } from 'utils/url';
import { menuItemBuilder, target as urlTarget } from 'utils/contentful';
import { services, logger } from 'topcoder-react-lib';

const ERRMSG_UNKNOWN_TARGET = 'Unknown action target';

export const TARGETS = {
  ASSETS: 'assets',
  ENTRIES: 'entries',
};

function bookContent(ids, target, preview, spaceName, environment) {
  return {
    ids,
    preview,
    spaceName,
    environment,
    target,
  };
}

function bookQuery(id, target, preview, spaceName, environment) {
  return {
    id,
    preview,
    spaceName,
    environment,
    target,
  };
}

function cleanState() {
  return Date.now();
}

function freeContent(ids, target, preview, spaceName, environment) {
  return {
    ids,
    preview,
    spaceName,
    environment,
    target,
  };
}

function freeQuery(id, target, preview, spaceName, environment) {
  return {
    id,
    preview,
    spaceName,
    environment,
    target,
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
  const service = getService({
    preview,
    spaceName,
    environment,
  });
  let content;
  try {
    switch (target) {
      case TARGETS.ASSETS:
        content = await service.getAsset(contentId);
        break;
      case TARGETS.ENTRIES:
        content = await service.getEntry(contentId);
        break;
      default:
        throw new Error(ERRMSG_UNKNOWN_TARGET);
    }
  } catch (e) {
    logger.error('getContentDone error', e);
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
  const service = getService({
    preview,
    spaceName,
    environment,
  });
  let data;
  try {
    switch (target) {
      case TARGETS.ASSETS:
        data = await service.queryAssets(query);
        break;
      case TARGETS.ENTRIES:
        data = await service.queryEntries(query);
        break;
      default:
        throw new Error(ERRMSG_UNKNOWN_TARGET);
    }
  } catch (e) {
    logger.error('queryContentDone error', e);
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

/**
 * Prepare menu fetching
 * @param {Object} menuProps The navi menu data from Contentful
 */
function getMenuInit(menuProps) {
  return {
    ...menuProps,
  };
}

/**
 * Fetches recursively complete navi menu data from Contentful
 * @param {Object} menuProps The navi menu data from Contentful
 */
async function getMenuDone(menuProps) {
  const {
    preview,
    spaceName,
    environment,
    fields,
  } = menuProps;
  let { baseUrl } = menuProps;
  let menu = []; // will store results here
  const service = getService({
    preview,
    spaceName,
    environment,
  });
  // remove trail slash from baseUrl
  baseUrl = fields.baseUrl ? removeTrailingSlash(fields.baseUrl) : baseUrl;
  // different menu strucures depending on title
  // if title is set new navi supports only 2 levels of menus
  // otherwise 3 when directly loaded
  if (fields.title) {
    menu.push({
      id: menuProps.id,
      title: fields.title,
      subMenu: [],
    });
  }
  // Prepare menu loading
  const l1P = _.map(
    fields.items,
    item => service.getEntry(item.sys.id)
      .then(async (L1Item) => {
        const mI = menuItemBuilder(baseUrl, L1Item);
        const {
          childRoutes,
          submenu,
        } = L1Item.fields;
        if (childRoutes) {
          mI.subMenu = await Promise.all(_.map(
            childRoutes,
            cR => service.getEntry(cR.sys.id)
              .then(
                async (cR2) => {
                  const url2 = urlTarget(baseUrl, L1Item);
                  const sI2 = menuItemBuilder(url2, cR2);
                  // no title => 3 level menu supported
                  if (!fields.title && cR2.fields.childRoutes) {
                    sI2.subMenu = await Promise.all(_.map(
                      cR2.fields.childRoutes,
                      cR3 => service.getEntry(cR3.sys.id)
                        .then(
                          async (c3) => {
                            const url3 = urlTarget(url2, cR2);
                            const sI3 = menuItemBuilder(url3, c3);
                            if (c3.fields.childRoutes) {
                              sI3.subMenu = await Promise.all(_.map(
                                c3.fields.childRoutes,
                                cR4 => service.getEntry(cR4.sys.id)
                                  .then(
                                    c4 => menuItemBuilder(url3, c4),
                                  ),
                              ));
                            }
                            return sI3;
                          },
                        ),
                    ));
                  }
                  return sI2;
                },
              ),
          ));
        }
        if (submenu) {
          const submenuNavi = await service.getEntry(submenu.sys.id);
          mI.subMenu = await Promise.all(_.map(
            submenuNavi.fields.items,
            subI => service.getEntry(subI.sys.id)
              .then(
                async (sub2) => {
                  const url2 = urlTarget(baseUrl, L1Item);
                  const sI2 = menuItemBuilder(url2, sub2);
                  // no title => 3 level menu supported
                  if (!fields.title && sub2.fields.submenu) {
                    const submenuNavi2 = await service.getEntry(sub2.fields.submenu.sys.id);
                    sI2.subMenu = await Promise.all(_.map(
                      submenuNavi2.fields.items,
                      cR3 => service.getEntry(cR3.sys.id)
                        .then(
                          s3 => menuItemBuilder(urlTarget(url2, sub2), s3),
                        ),
                    ));
                  }
                  return sI2;
                },
              ),
          ));
        }
        return mI;
      }),
  );
  // Load and wait for all menu data
  const menuData = await Promise.all(l1P);
  // Load logo if set
  let menuLogo;
  if (fields.logo) {
    menuLogo = await service.getAsset(fields.logo.sys.id);
  }
  // merge and return menu
  if (fields.title) {
    menu[0].subMenu = menuData;
  } else {
    menu = menuData;
  }
  // add the preconfigured secondary menus?
  if (fields.showSecondaryNaviMenu) {
    menu[0].secondaryMenu = config.HEADER_MENU[1].secondaryMenu;
  }

  return {
    id: menuProps.id,
    menu,
    menuLogo,
  };
}

/**
 * Prepare challenges block fetching
 * @param {Object} blockProps
 */
function getChallengesBlockInit(blockProps) {
  return {
    ...blockProps,
  };
}

/**
 * Fetchs challenges block needed data
 * @param {Object} blockProps
 */
async function getChallengesBlockDone(blockProps) {
  const {
    id,
    preview,
    spaceName,
    environment,
  } = blockProps;
  // get the Contentful data
  const service = getService({
    preview,
    spaceName,
    environment,
  });
  const block = await service.getEntry(id);
  // prepare for getting the challenges
  const challengesService = services.challenge.getService();
  const filter = {};
  if (!block.fields.completedChallenges) {
    filter.status = 'ACTIVE';
  }
  if (block.fields.challengeTitleContains) {
    filter.name = block.fields.challengeTitleContains;
  }
  if (block.fields.challengeType) {
    filter.subTrack = block.fields.challengeType.join(',');
  }
  if (block.fields.technologies) {
    filter.technologies = block.fields.technologies.join(',');
  }
  const challenges = await challengesService.getChallenges(filter);

  return {
    id,
    challenges: challenges.challenges,
    fields: block.fields,
  };
}

/**
 * Policy pages fetch init
 */
function getPolicyPagesInit() {
  return {};
}

/**
 * Policy pages fetch done
 */
async function getPolicyPagesDone() {
  const service = getService({
    preview: false,
    spaceName: 'default',
    environment: 'master',
  });

  const res = await service.queryEntries({
    content_type: 'policyPage',
  });

  return {
    data: [...res.items],
  };
}

/**
 * Thrive feed fetch init
 */
function getThriveArticlesInit() {
  return {};
}

/**
 * Thrive feed fetch done
 */
async function getThriveArticlesDone({ limit }) {
  const service = getService({ spaceName: 'EDU' });
  const res = await service.getEDUContent({
    limit,
    types: ['Article'],
    sortBy: 'date',
  });

  return _.get(res, 'Article.items', []);
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
    GET_MENU_INIT: getMenuInit,
    GET_MENU_DONE: getMenuDone,
    GET_CHALLENGES_BLOCK_INIT: getChallengesBlockInit,
    GET_CHALLENGES_BLOCK_DONE: getChallengesBlockDone,
    GET_POLICY_PAGES_INIT: getPolicyPagesInit,
    GET_POLICY_PAGES_DONE: getPolicyPagesDone,
    GET_THRIVE_ARTICLES_INIT: getThriveArticlesInit,
    GET_THRIVE_ARTICLES_DONE: getThriveArticlesDone,
  },
});
