/**
 * The routes related to Growsurf integration
 */

import _ from 'lodash';
import express from 'express';
import { middleware } from 'tc-core-library-js';
import config from 'config';
import GrowsurfService from '../services/growsurf';

const cors = require('cors');

const authenticator = middleware.jwtAuthenticator;
const authenticatorOptions = _.pick(config.SECRET.JWT_AUTH, ['AUTH_SECRET', 'VALID_ISSUERS']);
const routes = express.Router();

// Enables CORS on those routes according config above
// ToDo configure CORS for set of our trusted domains
routes.use(cors());
routes.options('*', cors());

routes.get('/participant/:emailOrId', (req, res) => new GrowsurfService().getParticipantController(req, res).then(res.send.bind(res)));
routes.get('/participants', (req, res) => new GrowsurfService().getParticipantsController(req, res).then(res.send.bind(res)));
routes.post('/participants', (req, res, next) => authenticator(authenticatorOptions)(req, res, next), (req, res) => new GrowsurfService().getOrCreateParticipantController(req, res).then(res.send.bind(res)));
routes.patch('/participant/:emailOrId', (req, res, next) => authenticator(authenticatorOptions)(req, res, next), (req, res) => new GrowsurfService().updateParticipantController(req, res).then(res.send.bind(res)));

export default routes;
