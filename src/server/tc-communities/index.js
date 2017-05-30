/**
 * Routes for demo API of tc-communities
 */

import express from 'express';
import { getCommunitiesMetadata } from 'utils/tc';

const router = express.Router();

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
