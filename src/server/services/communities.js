/**
 * Server-side version of Communities service.
 *
 * Note that import "services/communities" will import the isomorphic version of
 * Communities service, located inside /src/shared/services/communities.js
 */

import _ from 'lodash';
import fs from 'fs';
import { logger, services } from 'topcoder-react-lib';
import path from 'path';
import { isomorphy } from 'topcoder-react-utils';

const { api, groups } = services;

/* Holds the mapping between subdomains and communities. It is automatically
 * generated at startup, using "subdomains" property from community configs */
const SUBDOMAIN_COMMUNITY = {};

/**
 * Gets an instance of groups service, trying to reuse the same one,
 * if possible.
 */
async function getGroupsService() {
  const m2mToken = await api.getTcM2mToken();
  const cached = getGroupsService.cachedService;
  if (cached && m2mToken === cached.getTokenV3()) return cached;
  const res = groups.getService(m2mToken);
  getGroupsService.cachedService = res;
  return res;
}

const METADATA_PATH = path.resolve(__dirname, '../tc-communities');
const VALID_IDS = isomorphy.isServerSide()
&& fs.readdirSync(METADATA_PATH).filter((id) => {
  /* Here we check which ids are correct, and also popuate SUBDOMAIN_COMMUNITY
   * map. */
  const uri = path.resolve(METADATA_PATH, id, 'metadata.json');
  try {
    const meta = JSON.parse(fs.readFileSync(uri, 'utf8'));
    if (meta.subdomains) {
      meta.subdomains.forEach((subdomain) => {
        SUBDOMAIN_COMMUNITY[subdomain] = id;
      });
    }
    return true;
  } catch (e) {
    return false;
  }
});

/**
 * Given an array of group IDs, returns an array containing IDs of all those
 * groups, and also of all groups descendent from them.
 *
 * TODO: This function also can be moved to the groups service.
 *
 * @param {String[]} groupIds
 * @return {String[]}
 */
async function extendByChildGroups(groupIds) {
  const service = await getGroupsService();
  let res = [];
  for (let i = 0; i !== groupIds.length; i += 1) {
    /* eslint-disable no-await-in-loop */
    try {
      res = res.concat(await service.getGroupTreeIds(groupIds[i]));
    } catch (error) {
      /* Error here, most probably, means that the specified group is not known
       * to the TC Groups API. We ignore such errors, as there is no harm to do
       * so, and also because some groups exist only in some environment, thus
       * being to strict about them, would cause too much annoying issues during
       * development. */
    }
    /* eslint-enable no-await-in-loop */
  }
  return _.uniq(res);
}

/**
 * Gets metadata for the specified community.
 * @param {String} communityId
 * @return {Promise} Resolves to the community metadata.
 */
export async function getMetadata(communityId) {
  const now = Date.now();
  const cached = getMetadata.cache[communityId];
  if (cached && now - cached.timestamp < getMetadata.maxage) {
    return _.cloneDeep(cached.data);
  }

  let metadata;
  const uri = path.resolve(
    __dirname, '../tc-communities',
    communityId, 'metadata.json',
  );
  try {
    metadata = JSON.parse(fs.readFileSync(uri, 'utf8'));
  } catch (error) {
    const msg = `Failed to get metadata for ${communityId} community`;
    logger.error(msg, error);
    throw new Error(msg);
  }

  const challengeGroupIds = _.get(metadata, 'challengeFilter.groupIds');
  if (challengeGroupIds) {
    metadata.challengeFilter.groupIds = await extendByChildGroups(
      challengeGroupIds,
    );
  }
  if (metadata.authorizedGroupIds) {
    metadata.authorizedGroupIds = await extendByChildGroups(
      metadata.authorizedGroupIds,
    );
  }
  if (metadata.groupIds) {
    metadata.groupIds = await extendByChildGroups(metadata.groupIds);
  }

  // FIXME: This is a tempory patch to resolve "Backstage Error" that's showing up on Topgear
  // app due to missing "Wipro All" authorized group
  // Roll this back as soon as the root cause is fixed
  // which is likely either in topcoder-react-lib that handles merging groups (https://github.com/topcoder-platform/topcoder-react-lib/blob/c637525211550bea283390e52490fce7f6dd44a8/src/services/groups.js#L107)
  // or Groups Api
  if (communityId === 'wipro') {
    logger.info('Getting metadata for Topgear. Existing Authorized Groups', JSON.stringify(metadata.authorizedGroupIds));
    metadata.authorizedGroupIds = _.uniq(metadata.authorizedGroupIds.concat('b7f7c0f8-8ee8-409e-9e5c-33404983b635'));
    logger.info('After adding "Wipro All" group', JSON.stringify(metadata.authorizedGroupIds));
  }
  getMetadata.cache[communityId] = { data: metadata, timestamp: now };
  return _.cloneDeep(metadata);
}

getMetadata.cache = {};
getMetadata.maxage = 5 * 60 * 1000; // 5 min in ms.

/**
 * Gets the list of communities accessible to the member of specified groups.
 * @param {String[]} userGroupIds
 * @return {Promise} Resolves to the array of community data objects. Each of
 *  the objects indludes only the most important data on the community.
 */
export function getList(userGroupIds) {
  const list = [];
  return Promise.all(
    VALID_IDS.map(id => getMetadata(id).then((data) => {
      if (!data.authorizedGroupIds
          || _.intersection(data.authorizedGroupIds, userGroupIds).length) {
        list.push({
          challengeFilter: data.challengeFilter || {},
          communityId: data.communityId,
          communityName: data.communityName,
          description: data.description,
          groupIds: data.groupIds,
          hidden: data.hidden || false,
          hideFilter: data.hideFilter || false,
          image: data.image,
          mainSubdomain: _.get(data, 'subdomains[0]', ''),
        });
      }
    }).catch(() => null)),
  ).then(
    () => list.sort((a, b) => a.communityName.localeCompare(b.communityName)),
  );
}

/**
 * Given an array of URL subdomains it returns TC community ID, if some
 * community is mounted on these subdomains, or an empty string otherwise.
 * @param {String Array} subdomains
 * @return {String}
 */
export function getCommunityId(subdomains) {
  if (!subdomains) return '';
  for (let i = 0; i < subdomains.length; i += 1) {
    const communityId = SUBDOMAIN_COMMUNITY[subdomains[i]];
    if (communityId) return communityId;
  }
  return '';
}
