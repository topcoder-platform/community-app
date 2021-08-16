/* eslint-disable max-len */
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

routes.get('/:id', (req, res) => new GSheetService().getSheetAPI(req, res));
// routes.post('/:id', (req, res) => new GSheetService().addToSheetAPI(req, res)); // Enable it for API access to gsheets editing when needed

export default routes;
