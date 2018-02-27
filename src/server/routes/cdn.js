/**
 * The routes that expose our content to Content Delivery Networks.
 */

import express from 'express';

import contentfulRoutes from './contentful';

const router = express.Router();

router.use('/public/contentful', contentfulRoutes);

export default router;
