/**
 * Route declarations.
 */

import express from 'express';

import {
  getSubmissionsController,
  getSubmissionInfoController,
} from '../controllers/submissions';

const router = express.Router();

router.get('/:submissionId', getSubmissionInfoController);
router.get('/', getSubmissionsController);

export default router;
