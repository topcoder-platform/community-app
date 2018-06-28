/**
 * The routes that expose assets and content from Contentful CMS to the CDN.
 */

import config from 'config';
import express from 'express';

import {
  ASSETS_DOMAIN,
  IMAGES_DOMAIN,
  cdnService,
  // getIndex,
  // getNextSyncUrl,
  previewService,
} from '../services/contentful';

const routes = express.Router();

const LOCAL_MODE = Boolean(config.CONTENTFUL.LOCAL_MODE);

/* Sets Access-Control-Allow-Origin header to avoid CORS error.
 * TODO: Replace the wildcard value by an appropriate origin filtering. */
routes.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

/* Gets non-image asset file. */
routes.use('/assets/:id/:version/:name', (req, res) => {
  res.redirect(`https://${ASSETS_DOMAIN}/${config.SECRET.CONTENTFUL.SPACE_ID}/${req.params.id}/${req.params.version}/${req.params.name}`);
});

/* Gets image file. */
routes.use('/images/:id/:version/:name', (req, res) => {
  res.redirect(`https://${IMAGES_DOMAIN}/${config.SECRET.CONTENTFUL.SPACE_ID}/${req.params.id}/${req.params.version}/${req.params.name}`);
});

/* Gets preview of the specified asset. */
routes.use('/preview/assets/:id', (req, res, next) => previewService.getAsset(req.params.id, !LOCAL_MODE)
  .then(res.send.bind(res), next));

/* Queries asset previews. */
routes.use('/preview/assets', (req, res, next) => previewService.queryAssets(req.query, !LOCAL_MODE)
  .then(res.send.bind(res), next));

/* Gets preview of the specified entry. */
routes.use('/preview/entries/:id', (req, res, next) => previewService.getEntry(req.params.id).then(res.send.bind(res), next));

/* Queries entry previews. */
routes.use('/preview/entries', (req, res, next) => previewService.queryEntries(req.query).then(res.send.bind(res), next));

/* Gets the specified published asset. */
routes.use('/published/assets/:id', (req, res, next) => cdnService.getAsset(req.params.id, !LOCAL_MODE)
  .then(res.send.bind(res), next));

/* Queries published assets. */
routes.use('/published/assets', (req, res, next) => cdnService.queryAssets(req.query, !LOCAL_MODE)
  .then(res.send.bind(res), next));

/* Gets the specified published entry. */
routes.use('/published/entries/:id', (req, res, next) => cdnService.getEntry(req.params.id).then(res.send.bind(res), next));

/* Queries published entries. */
routes.use('/published/entries', (req, res, next) => cdnService.queryEntries(req.query).then(res.send.bind(res), next));

/* Returns index of assets and content. */
/*
routes.use('/index', async (req, res, next) => {
  try {
    res.set('Cache-Control', `max-age=${1000}`);
    res.send(await getIndex());
  } catch (err) { next(err); }
});
*/

/* Returns URL for the next sync of assets and content index with Contentful
 * API. */
/*
routes.use('/next-sync-url', async (req, res, next) => {
  try {
    res.set('Cache-Control', `max-age=${1000}`);
    res.send(await getNextSyncUrl());
  } catch (err) { next(err); }
});
*/

export default routes;
