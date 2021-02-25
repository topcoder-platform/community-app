/**
 * The routes related to Growsurf integration
 */

import express from 'express';
import GrowsurfService from '../services/growsurf';

const cors = require('cors');

const routes = express.Router();

// Enables CORS on those routes according config above
// ToDo configure CORS for set of our trusted domains
routes.use(cors());
routes.options('*', cors());

routes.get('/participants', (req, res) => new GrowsurfService().getParticipant(req, res).then(res.send.bind(res)));
routes.post('/participants', (req, res) => new GrowsurfService().getOrCreateParticipant(req, res).then(res.send.bind(res)));

export default routes;
