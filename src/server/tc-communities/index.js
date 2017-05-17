/**
 * Routes for demo API of tc-communities
 */

import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

/**
 * Endpoint for community meta data
 */
router.get('/:communityId/meta', (req, res) => {
  const communityId = req.params.communityId;

  fs.readFile(path.resolve(__dirname, `${communityId}/metadata.json`), 'utf8', (err, data) => {
    if (err) {
      res.status(404).send();
    } else {
      const metadata = JSON.parse(data);
      res.json(metadata);
    }
  });
});

export default router;
