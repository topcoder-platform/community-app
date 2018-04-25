/**
 * Routes for demo API of tc-communities
 */

import CommunitiesService from 'server/services/communities';
import express from 'express';

const router = express.Router();

/**
 * GET challenge filters for public and specified private communities.
 * As of now, it expects that array of IDs of groups a user has access to
 * will be passed in the query. It uses these IDs to determine which communities
 * should be included into the response.
 */
router.get('/', (req, res) => {
  const tokenV3 = req.headers.authorization;
  new CommunitiesService(tokenV3).getList(req.query.groups || [])
    .catch(err => res.status(500).send(err))
    .then(list => res.json(list));
});

/**
 * Endpoint for community meta data
 */
router.get('/:communityId/meta', (req, res) => {
  const { communityId } = req.params;
  const tokenV3 = req.headers.authorization;
  new CommunitiesService(tokenV3).getMetadata(communityId)
    .catch(err => res.status(404).send(err))
    .then(data => res.json(data));
});

export default router;
