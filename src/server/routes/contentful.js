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
routes.use(
  '/:spaceName/:environment/assets/:id/:version/:name',
  (req, res) => {
    const {
      environment,
      id,
      name,
      spaceName,
      version,
    } = req.params;
    const spaceId = getSpaceId(spaceName);
    res.redirect(`https://${ASSETS_DOMAIN}/spaces/${spaceId}/environments/${environment}/${id}/${version}/${name}`);
  },
);

/* Gets image file. */
routes.use(
  '/:spaceName/:environment/images/:id/:version/:name',
  (req, res) => {
    const {
      environment,
      id,
      name,
      spaceName,
      version,
    } = req.params;
    const spaceId = getSpaceId(spaceName);
    res.redirect(`https://${IMAGES_DOMAIN}/spaces/${spaceId}/environments/${environment}/${id}/${version}/${name}`);
  },
);

/* Gets preview of the specified space_name, environment & asset. */
routes.use('/:spaceName/:environment/preview/assets/:id', (req, res, next) => {
  const { environment, id, spaceName } = req.params;
  getService(spaceName, environment, true)
    .getAsset(id, !LOCAL_MODE)
    .then(res.send.bind(res), next);
});

/* Queries asset previews of the specified space name & environment. */
routes.use('/:spaceName/:environment/preview/assets', (req, res, next) => {
  const { environment, spaceName } = req.params;
  getService(spaceName, environment, true)
    .queryAssets(req.query, !LOCAL_MODE)
    .then(res.send.bind(res), next);
});

/* Gets preview of the specified space name, environment & entry. */
routes.use('/:spaceName/:environment/preview/entries/:id', (req, res, next) => {
  const { environment, id, spaceName } = req.params;
  getService(spaceName, environment, true)
    .getEntry(id)
    .then(res.send.bind(res), next);
});

/* Queries entry previews of the specified space name & environment. */
routes.use('/:spaceName/:environment/preview/entries', (req, res, next) => {
  const { environment, spaceName } = req.params;
  getService(spaceName, environment, true)
    .queryEntries(req.query)
    .then(res.send.bind(res), next);
});

/* Gets the specified published asset of given space name & environment. */
routes.use(
  '/:spaceName/:environment/published/assets/:id',
  (req, res, next) => {
    const { environment, id, spaceName } = req.params;
    getService(spaceName, environment, false)
      .getAsset(id, !LOCAL_MODE)
      .then(res.send.bind(res), next);
  },
);

/* Queries published assets of a given space name & environment. */
routes.use(':spaceName/:environment/published/assets', (req, res, next) => {
  const { environment, spaceName } = req.params;
  getService(spaceName, environment, false)
    .queryAssets(req.query, !LOCAL_MODE)
    .then(res.send.bind(res), next);
});

/* Gets the specified published entry of a given space name & environment. */
routes.use(
  '/:spaceName/:environment/published/entries/:id',
  (req, res, next) => {
    const { environment, id, spaceName } = req.params;
    getService(spaceName, environment, false)
      .getEntry(id)
      .then(res.send.bind(res), next);
  },
);

/* Queries published entries of a given space name and environment. */
routes.use('/:spaceName/:environment/published/entries', (req, res, next) => {
  const { environment, spaceName } = req.params;
  getService(spaceName, environment, false)
    .queryEntries(req.query)
    .then(res.send.bind(res), next);
});

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
