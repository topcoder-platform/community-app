/**
 * The routes that expose our content to Content Delivery Networks.
 */

import express from 'express';
import path from 'path';
import { config } from 'topcoder-react-utils';
import qs from 'qs';

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
  res.set('Access-Control-Allow-Origin', `${config.CDN.ACCESS_CONTROL_ALLOW_ORIGIN}`);
  next();
}, express.static(url),

/* If requested asset has not been found by ExpressJS - bail out with 404 error,
 * otherwise, at the moment, we cannot ensure proper 404 status inside ReactJS
 * renderer (due to lack of support for server-side rendering of Contentful
 * routes). */
(req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// proxy to new forums API
// used to avoid CORS issues when community-app needs fetch data from it
router.get('/public/forums/discussions', (req, res, next) => {
  fetch(`${config.URL.FORUMS_VANILLA}/api/v2/discussions?${qs.stringify(req.query)}`)
    .then(rsp => rsp.json(rsp))
    .then(data => res.json(data))
    .catch(next);
});

export default router;
