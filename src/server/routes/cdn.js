/**
 * The routes that expose our content to Content Delivery Networks.
 */

import express from 'express';

import avatarRoutes from './avatar';
import contentfulRoutes from './contentful';

const router = express.Router();

router.use('/public/ping', (req, res) => res.send('PONG!'));

router.use('/public/avatar', avatarRoutes);
router.use('/public/contentful', contentfulRoutes);

export default router;
