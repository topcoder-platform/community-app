/**
 * The routes that expose assets and content from Contentful CMS to the CDN.
 */

import express from 'express';
import { middleware } from 'tc-core-library-js';
import config from 'config';
import _ from 'lodash';
import {
  getService,
  articleVote,
} from '../services/contentful';
import { getPayloadAssetUrl } from '../services/cms-urls';

const cors = require('cors');

const authenticator = middleware.jwtAuthenticator;
const authenticatorOptions = _.pick(config.SECRET.JWT_AUTH, ['AUTH_SECRET', 'VALID_ISSUERS']);
const routes = express.Router();

// Enables CORS on those routes according config above
// ToDo configure CORS for set of our trusted domains
routes.use(cors());
routes.options('*', cors());

async function redirectPayloadAsset(req, res, next) {
  try {
    const { environment, id, spaceName } = req.params;
    const asset = await getService(spaceName, environment, false).getAsset(id);
    const url = getPayloadAssetUrl(_.get(asset, 'fields.file.url'));
    res.redirect(url);
  } catch (error) {
    next(error);
  }
}

/* Legacy asset URLs resolve through Payload and may redirect only to the
 * configured S3-backed asset origin. Version and name remain for old links but
 * are never trusted as a destination. */
routes.use('/:spaceName/:environment/assets/:id/:version/:name', redirectPayloadAsset);
routes.use('/:spaceName/:environment/images/:id/:version/:name', redirectPayloadAsset);

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
      next(e);
    }
  },
);

/* Queries published assets of a given space name & environment. */
routes.use('/:spaceName/:environment/published/assets', (req, res, next) => {
  try {
    const { environment, spaceName } = req.params;
    getService(spaceName, environment, false)
      .queryAssets(req.query)
      .then(res.send.bind(res), next);
  } catch (e) {
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
      next(e);
    }
  },
);

/* Queries published entries of a given space name and environment. */
routes.use('/:spaceName/:environment/published/entries', (req, res, next) => {
  try {
    const { environment, spaceName } = req.params;
    getService(spaceName, environment, false)
      .queryEntries(req.query)
      .then(res.send.bind(res), next);
  } catch (e) {
    next(e);
  }
});

/* Update votes on article. */
routes.use('/:spaceName/:environment/votes', (req, res, next) => authenticator(authenticatorOptions)(req, res, next), (req, res, next) => {
  try {
    articleVote(req.body, req.params.spaceName, req.params.environment)
      .then(res.send.bind(res), next);
  } catch (e) {
    next(e);
  }
});

export default routes;
