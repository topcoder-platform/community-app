/**
 * Routes for demo API of tc-communities
 */

import _ from 'lodash';
import express from 'express';
import fs from 'fs';
import { getCommunitiesMetadata } from 'utils/tc';

const router = express.Router();

/**
 * GET challenge filters for public and specified private communities.
 * As of now, it expects that array of IDs of groups a user has access to
 * will be passed in the query. It uses these IDs to determine which communities
 * should be included into the response.
 */
router.get('/', (req, res) => {
  const filters = [];
  const groups = new Set(req.query.groups || []);
  const communities = fs.readdirSync(__dirname);
  communities.forEach((community) => {
    try {
      const path = `${__dirname}/${community}/metadata.json`;
      const data = JSON.parse(fs.readFileSync(path, 'utf8'));
      if (!data.authorizedGroupIds
      || data.authorizedGroupIds.some(id => groups.has(id))) {
        filters.push({
          filter: data.challengeFilter || {},
          id: data.communityId,
          name: data.communityName,
        });
      }
    } catch (e) {
      _.noop();
    }
  });
  filters.sort((a, b) => a.name.localeCompare(b.name));
  res.json(filters);
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
