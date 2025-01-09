/**
 * The routes related to MMLeaderboard integration
 */

import express from 'express';
import MMLService from '../services/mmLeaderboard';

const cors = require('cors');

const routes = express.Router();

// Enables CORS on those routes according config above
// ToDo configure CORS for set of our trusted domains
routes.use(cors());
routes.options('*', cors());

routes.get('/:id', (req, res, next) => new MMLService().getLeaderboard(req, res, next));

export default routes;
