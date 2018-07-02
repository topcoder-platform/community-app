/**
 * The routes that expose our content to Content Delivery Networks.
 */

import express from 'express';
import path from 'path';

import avatarRoutes from './avatar';
import contentfulRoutes from './contentful';

import getExchangeRates from '../services/money';

const router = express.Router();

router.use('/public/ping', (req, res) => res.send('PONG!'));

router.use('/public/avatar', avatarRoutes);
router.use('/public/contentful', contentfulRoutes);

router.use('/public/exchange-rates', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Cache-Control', 'max-age=3600');
  getExchangeRates().then(rates => res.send(rates), next);
});

const url = path.resolve(__dirname, '../../../build');

/* Sets Access-Control-Allow-Origin header to avoid CORS error.
 * TODO: Replace the wildcard value by an appropriate origin filtering. */
router.use('/public/static-assets', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
}, express.static(url));

export default router;
