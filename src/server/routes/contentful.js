/**
 * The routes that expose assets and content from Contentful CMS to the CDN.
 */

import express from 'express';
import { middleware } from 'tc-core-library-js';
import config from 'config';
import _ from 'lodash';
import {
  ASSETS_DOMAIN,
  IMAGES_DOMAIN,
  getService,
  getSpaceId,
  articleVote,
  ALLOWED_DOMAINS,
} from '../services/contentful';

const cors = require('cors');

const authenticator = middleware.jwtAuthenticator;
const authenticatorOptions = _.pick(config.SECRET.JWT_AUTH, ['AUTH_SECRET', 'VALID_ISSUERS']);
const routes = express.Router();

// Enables CORS on those routes according config above
// ToDo configure CORS for set of our trusted domains
routes.use(cors());
routes.options('*', cors());

/* Gets non-image asset file. */
routes.use(
  '/:spaceName/:environment/assets/:id/:version/:name',
  (req, res) => {
    try {
      const {
        environment,
        id,
        name,
        spaceName,
        version,
      } = req.params;
      const spaceId = getSpaceId(spaceName);
      if (!ALLOWED_DOMAINS.includes(ASSETS_DOMAIN)) {
        console.log('Invalid domain detected!');
        throw new Error('Invalid domain detected!');
      }
      const url = new URL(`https://${ASSETS_DOMAIN}/spaces/${spaceId}/environments/${environment}/${id}/${version}/${name}`);
      res.redirect(url.href);
    } catch (e) {
      console.log('error in getting asset', e);
    }
  },
);

/* Gets image file. */
routes.use(
  '/:spaceName/:environment/images/:id/:version/:name',
  (req, res) => {
    try {
      const {
        environment,
        id,
        name,
        spaceName,
        version,
      } = req.params;
      if (!ALLOWED_DOMAINS.includes(IMAGES_DOMAIN)) {
        throw new Error('Invalid domain detected!');
      }
      const spaceId = getSpaceId(spaceName);
      const url = new URL(`https://${IMAGES_DOMAIN}/spaces/${spaceId}/environments/${environment}/${id}/${version}/${name}`);
      res.redirect(url.href);
    } catch (e) {
      console.log('error in getting image', e);
    }
  },
);

/* Gets preview of the specified space_name, environment & asset. */
routes.use('/:spaceName/:environment/preview/assets/:id', (req, res, next) => {
  const { environment, id, spaceName } = req.params;
  getService(spaceName, environment, true)
    .getAsset(id)
    .then(res.send.bind(res), next);
});

/* Queries asset previews of the specified space name & environment. */
routes.use('/:spaceName/:environment/preview/assets', (req, res, next) => {
  const { environment, spaceName } = req.params;
  getService(spaceName, environment, true)
    .queryAssets(req.query)
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
    try {
      const { environment, id, spaceName } = req.params;
      getService(spaceName, environment, false)
        .getAsset(id)
        .then(res.send.bind(res), next);
    } catch (e) {
      console.log('error in getting published asset', e);
      next(e);
    }
  },
);

/* Queries published assets of a given space name & environment. */
routes.use(':spaceName/:environment/published/assets', (req, res, next) => {
  try {
    const { environment, spaceName } = req.params;
    getService(spaceName, environment, false)
      .queryAssets(req.query)
      .then(res.send.bind(res), next);
  } catch (e) {
    console.log('error in getting published assets', e);
    next(e);
  }
});

/* Gets the specified published entry of a given space name & environment. */
routes.use(
  '/:spaceName/:environment/published/entries/:id',
  (req, res, next) => {
    try {
      const { environment, id, spaceName } = req.params;
      getService(spaceName, environment, false)
        .getEntry(id)
        .then(res.send.bind(res), next);
    } catch (e) {
      console.log('error in getting published entry', e);
      next(e);
    }
  },
);

/* Queries published entries of a given space name and environment. */
routes.use('/:spaceName/:environment/published/entries', (req, res, next) => {
  try {
    console.log('hits cdn published entries');
    const { environment, spaceName } = req.params;
    getService(spaceName, environment, false)
      .queryEntries(req.query)
      .then(res.send.bind(res), next);
  } catch (e) {
    console.log('error in getting published entries', e);
    next(e);
  }
});

/* Update votes on article. */
routes.use('/:spaceName/:environment/votes', (req, res, next) => authenticator(authenticatorOptions)(req, res, next), (req, res, next) => {
  try {
    articleVote(req.body)
      .then(res.send.bind(res), next);
  } catch (e) {
    console.log('error in voting', e);
    next(e);
  }
});

export default routes;
