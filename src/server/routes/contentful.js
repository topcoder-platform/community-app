/**
 * The routes that expose assets and content from Contentful CMS to the CDN.
 */

import config from 'config';
import express from 'express';

import {
  ASSETS_DOMAIN,
  IMAGES_DOMAIN,
  getService,
  getSpaceId,
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
routes.use('/:space_name/:environment/assets/:id/:version/:name', (req, res) => {
  const spaceId = getSpaceId(req.space_name);
  res.redirect(`https://${ASSETS_DOMAIN}/spaces/${spaceId}/environments/${req.environment}/${req.params.id}/${req.params.version}/${req.params.name}`);
});

/* Gets image file. */
routes.use('/:space_name/:environment/images/:id/:version/:name', (req, res) => {
  const spaceId = getSpaceId(req.space_name);
  res.redirect(`https://${IMAGES_DOMAIN}/spaces/${spaceId}/environments/${req.environment}/${req.params.id}/${req.params.version}/${req.params.name}`);
});

/* Gets preview of the specified space_name, environment & asset. */
routes.use('/:space_name/:environment/preview/assets/:id', (req, res, next) => getService(req.space_name, req.environment, true)
  .getAsset(req.params.id, !LOCAL_MODE)
  .then(res.send.bind(res), next));

/* Queries asset previews of the specified space name & environment. */
routes.use('/:space_name/:environment/preview/assets', (req, res, next) => getService(req.space_name, req.environment, true)
  .queryAssets(req.query, !LOCAL_MODE)
  .then(res.send.bind(res), next));

/* Gets preview of the specified space name, environment & entry. */
routes.use('/:space_name/:environment/preview/entries/:id', (req, res, next) => getService(req.space_name, req.environment, true)
  .getEntry(req.params.id).then(res.send.bind(res), next));

/* Queries entry previews of the specified space name & environment. */
routes.use('/:space_name/:environment/preview/entries', (req, res, next) => getService(req.space_name, req.environment, true)
  .queryEntries(req.query).then(res.send.bind(res), next));

/* Gets the specified published asset of given space name & environment. */
routes.use('/:space_name/:environment/published/assets/:id', (req, res, next) => getService(req.space_name, req.environment, false)
  .getAsset(req.params.id, !LOCAL_MODE)
  .then(res.send.bind(res), next));

/* Queries published assets of a given space name & environment. */
routes.use('/published/assets', (req, res, next) => getService(req.space_name, req.environment, false)
  .queryAssets(req.query, !LOCAL_MODE)
  .then(res.send.bind(res), next));

/* Gets the specified published entry of a given space name & environment. */
routes.use('/:space_name/:environment/published/entries/:id', (req, res, next) => getService(req.space_name, req.environment, false)
  .getEntry(req.params.id).then(res.send.bind(res), next));

/* Queries published entries of a given space name and environment. */
routes.use('/:space_name/:environment/published/entries', (req, res, next) => getService(req.space_name, req.environment, false)
  .queryEntries(req.query).then(res.send.bind(res), next));

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
