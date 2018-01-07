/**
 * Server-side version of Communities service.
 *
 * Note that import "services/communities" will import the isomorphic version of
 * Communities service, located inside /src/shared/services/communities.js
 */

import _ from 'lodash';
import fs from 'fs';
import logger from 'utils/logger';
import path from 'path';
import {
  addDescendantGroups,
  getService as getGroupsService,
} from 'services/groups';
import { isServerSide } from 'utils//isomorphy';

/* Holds the mapping between subdomains and communities. It is automatically
 * generated at startup, using "subdomains" property from community configs */
const SUBDOMAIN_COMMUNITY = {};

/**
 * Community metadata are currently read from config files. Here we lookup all
 * of them at startup to reuse later in the service.
 */
const METADATA_PATH = path.resolve(__dirname, '../tc-communities');
const VALID_IDS = isServerSide()
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
 * Private. Pushes into "unknown" array all element of "ids" array that are not
 * present as keys in "known" object. Does nothing if "ids" is undefined.
 * @param {String[]} ids
 * @param {Object} known
 * @param {String[]} unknown
 */
function addUnknown(ids, known, unknown) {
  if (ids) ids.forEach(id => (known[id] ? null : unknown.push(id)));
}

export default class Communities {
  constructor(tokenV3) {
    this.private = {
      groupsService: getGroupsService(tokenV3),
      tokenV3,
    };

    /* Private implementation of getMetadata(..) method. It allows to pass in
     * a map of known user groups as the second argument. This method can mutate
     * its second argument; and it does not care about timestamps of known
     * groups, assuming they are up-to-date. */
    this.private.getMetadata = (communityId, knownGroups = {}) =>
      new Promise((resolve, reject) => {
        const uri = path.resolve(__dirname, '../tc-communities',
          communityId, 'metadata.json');

        /* Metadata itself, at the moment, are read from configuration files. */
        fs.readFile(uri, 'utf8', (err, res) => {
          if (err) {
            const msg = `Failed to get metadata for ${communityId} community`;
            logger.error(msg, err);
            return reject({ error: msg });
          }

          /* Once we have loaded metadata, we extend all fields that hold user
           * group IDs with IDs of their descendant groups. This simplifies
           * a lot of code depending on community metadata, as then there is
           * no need to handle user groups data in each place where we rely on
           * group IDs from metadata. */
          const unknownGroups = [];
          const data = JSON.parse(res);
          const challengeGroupIds = _.get(data, 'challengeFilter.groupIds');
          addUnknown(data.authorizedGroupIds, knownGroups, unknownGroups);
          addUnknown(challengeGroupIds, knownGroups, unknownGroups);
          addUnknown(data.groupIds, knownGroups, unknownGroups);
          return Promise.resolve(unknownGroups.length ? (
            this.private.groupsService.getGroupMap(unknownGroups)
              .then(map => _.assign(knownGroups, map))
          ) : null).then(() => {
            if (data.authorizedGroupIds) {
              data.authorizedGroupIds = addDescendantGroups(
                data.authorizedGroupIds, knownGroups);
            }
            if (data.groupIds) {
              data.groupIds = addDescendantGroups(data.groupIds, knownGroups);
            }
            if (challengeGroupIds) {
              data.challengeFilter.groupIds = addDescendantGroups(
                challengeGroupIds, knownGroups);
            }
            resolve(data);
          });
        });
      });
  }

  /**
   * Gets the list of communities accessible to the member of specified groups.
   * @param {String[]} userGroupIds
   * @return {Promise} Resolves to the array of community data objects. Each of
   *  the objects indludes only the most important data on the community.
   */
  getList(userGroupIds) {
    const list = [];
    const knownGroups = {};
    return Promise.all(
      VALID_IDS.map(id =>
        this.private.getMetadata(id, knownGroups).then((data) => {
          if (!data.authorizedGroupIds ||
          _.intersection(data.authorizedGroupIds, userGroupIds).length) {
            list.push({
              challengeFilter: data.challengeFilter || {},
              communityId: data.communityId,
              communityName: data.communityName,
              description: data.description,
              groupIds: data.groupIds,
              hidden: data.hidden || false,
              image: data.image,
              mainSubdomain: _.get(data, 'subdomains[0]', ''),
            });
          }
        }).catch(() => null),
      ),
    ).then(() =>
      list.sort((a, b) => a.communityName.localeCompare(b.communityName)),
    );
  }

  /**
   * Gets metadata for the specified community.
   * @param {String} communityId
   * @return {Promise} Resolves to the community metadata.
   */
  getMetadata(communityId) {
    return this.private.getMetadata(communityId);
  }
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
