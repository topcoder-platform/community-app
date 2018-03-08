/**
 * The routes that expose assets and content from Contentful CMS to the CDN.
 */

import config from 'config';
import express from 'express';

import {
  cdnService,
  getIndex,
  getCurrentDashboardAnnouncementId,
  getCurrentDashboardAnnouncementsIndex,
  getNextSyncUrl,
  previewService,
} from '../services/contentful';

const routes = express.Router();

/* Sets Access-Control-Allow-Origin header to avoid CORS error.
 * TODO: Replace the wildcard value by an appropriate origin filtering. */
routes.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

/* Proxies asset requests to Contentful API. */
routes.use('/assets/:id', async (req, res, next) => {
  try {
    res.send(await cdnService.getAsset(req.params.id, true));
  } catch (err) { next(err); }
});

/* Proxies asset preview requests to Contentful API. */
routes.use('/assets/:id/preview', async (req, res, next) => {
  try {
    res.send(await previewService.getAsset(req.params.id, true));
  } catch (err) { next(err); }
});

/* Returns ID of the current dashboard announcement. */
routes.use('/current-dashboard-announcement-id', async (req, res, next) => {
  try {
    res.set('Cache-Control', `max-age=${1000}`);
    res.send(await getCurrentDashboardAnnouncementId());
  } catch (err) { next(err); }
});

/* Returns public index of current dashboard announcements. */
routes.use('/current-dashboard-announcements-index', async (req, res, next)
=> {
  try {
    res.set('Cache-Control', `max-age=${1000}`);
    res.send(await getCurrentDashboardAnnouncementsIndex());
  } catch (err) { next(err); }
});

/* Returns index of assets and content. */
routes.use('/index', async (req, res, next) => {
  try {
    res.set('Cache-Control', `max-age=${1000}`);
    res.send(await getIndex());
  } catch (err) { next(err); }
});

/* Returns URL for the next sync of assets and content index with Contentful
 * API. */
routes.use('/next-sync-url', async (req, res, next) => {
  try {
    res.set('Cache-Control', `max-age=${1000}`);
    res.send(await getNextSyncUrl());
  } catch (err) { next(err); }
});

/* Proxies content requests to Contentful API. */
routes.use('/entries/:id', async (req, res, next) => {
  try {
    res.send(await cdnService.getContentEntry(req.params.id));
  } catch (err) { next(err); }
});

/* Proxies content preview requests to Contentful API. */
routes.use('/entries/:id/preview', async (req, res, next) => {
  try {
    res.send(await previewService.getContentEntry(req.params.id));
  } catch (err) { next(err); }
});

/* Proxies image requests to Contentful API. */
routes.use('/images/:id/:version/:name', (req, res) => {
  res.redirect(`https://images.ctfassets.net/${
    config.SECRET.CONTENTFUL.SPACE_ID}/${req.params.id}/${
    req.params.version}/${req.params.name}`);
});

export default routes;
