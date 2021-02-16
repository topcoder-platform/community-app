/**
 * The routes related to GSheets integration
 */

import express from 'express';
import GSheetService from '../services/gSheet';

const cors = require('cors');

const routes = express.Router();

// Enables CORS on those routes according config above
// ToDo configure CORS for set of our trusted domains
routes.use(cors());
routes.options('*', cors());

routes.get('/:id', (req, res) => new GSheetService().getSheet(req, res));

export default routes;
