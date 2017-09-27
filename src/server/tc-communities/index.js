/**
 * Routes for demo API of tc-communities
 */

import express from 'express';
import fs from 'fs';
import {
  checkGroupsStatus,
  checkUserGroups,
  getService as getGroupsService,
} from 'services/groups';
import {
  getAuthTokens,
  getCommunitiesMetadata,
} from 'utils/tc';

const router = express.Router();

/**
 * GET challenge filters for public and specified private communities.
 * As of now, it expects that array of IDs of groups a user has access to
 * will be passed in the query. It uses these IDs to determine which communities
 * should be included into the response.
 */
router.get('/', (req, res) => {
  let knownGroups = {};
  const tokens = getAuthTokens(req);
  const groupsService = getGroupsService(tokens.tokenV3);
  const list = [];
  const communities = fs.readdirSync(__dirname);
  const userGroups = req.query.groups
    ? req.query.groups.map(id => ({ id })) : [];
  Promise.all(communities.map((community) => {
    try {
      const path = `${__dirname}/${community}/metadata.json`;
      const data = JSON.parse(fs.readFileSync(path, 'utf8'));
      return new Promise((resolve) => {
        if (data.authorizedGroupIds) {
          const missing = checkGroupsStatus(
            data.authorizedGroupIds, knownGroups).missing;
          if (missing) {
            return resolve(groupsService.getGroupMap(missing)
              .then((groups) => {
                knownGroups = { ...knownGroups, ...groups };
              }),
            );
          }
        }
        return resolve(undefined);
      }).then(() => {
        if (!data.authorizedGroupIds
        || checkUserGroups(data.authorizedGroupIds, userGroups, knownGroups)) {
          list.push({
            challengeFilter: data.challengeFilter || {},
            communityId: data.communityId,
            communityName: data.communityName,
            description: data.description,
            groupId: data.groupId,
            image: data.image,
          });
        }
      });
    } catch (e) {
      return undefined;
    }
  })).then(() => {
    list.sort((a, b) => a.communityName.localeCompare(b.communityName));
    res.json(list);
  });
});

/**
 * Endpoint for community meta data
 */
router.get('/:communityId/meta', (req, res) => {
  const communityId = req.params.communityId;

  getCommunitiesMetadata(communityId).then((data) => {
    res.json(data);
  }).catch(() => {
    res.status(404).send();
  });
});

export default router;
