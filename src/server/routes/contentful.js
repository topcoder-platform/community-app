/**
 * The routes that expose assets and content from Contentful CMS to the CDN.
 */

import config from 'config';
import fetch from 'isomorphic-fetch';
import express from 'express';

import {
  getIndex,
  getCurrentDashboardAnnouncementId,
  getCurrentDashboardAnnouncementsIndex,
} from '../services/contentful';

const BASE_URL =
  `https://cdn.contentful.com/spaces/${config.CONTENTFUL_CMS.SPACE}`;
const KEY = config.CONTENTFUL_CMS.CDN_API_KEY;

const routes = express.Router();

/* Proxies asset requests to Contentful CDN.
 * TODO: Move the actual logic to the service. */
routes.use('/assets/:id', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const x = await fetch(`${BASE_URL}/assets/${req.params.id}`, {
    headers: {
      Authorization: `Bearer ${KEY}`,
    },
  });
  if (!x.ok) res.sendStatus(x.status);
  else res.json(await x.json());
});

routes.use('/current-dashboard-announcement-id', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.send(await getCurrentDashboardAnnouncementId());
});

routes.use('/current-dashboard-announcements-index', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.send(await getCurrentDashboardAnnouncementsIndex());
});

routes.use('/index', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.send(await getIndex());
});

/* Proxies content requests to Contentful CDN.
 * TODO: Move the actual logic to the service. */
routes.use('/entries/:id', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const x = await fetch(`${BASE_URL}/entries/${req.params.id}`, {
    headers: {
      Authorization: `Bearer ${KEY}`,
    },
  });
  if (!x.ok) res.sendStatus(x.status);
  else res.json(await x.json());
});

routes.use('/images/:id/:version/:name', (req, res) => {
  res.redirect(`//images.contentful.com/${config.CONTENTFUL_CMS.SPACE}/${
    req.params.id}/${req.params.version}/${req.params.name}`);
});

export default routes;
