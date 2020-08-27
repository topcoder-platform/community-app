/**
 * The routes related to RecruitCRM.io integration
 */

import express from 'express';
import RecruitCRMService from '../services/recruitCRM';

const cors = require('cors');

const routes = express.Router();

// Enables CORS on those routes according config above
// ToDo configure CORS for set of our trusted domains
routes.use(cors());
routes.options('*', cors());

routes.get('/jobs', (req, res, next) => new RecruitCRMService().getAllJobs(req, res, next));

routes.get('/jobs/search', (req, res, next) => new RecruitCRMService().getJobs(req, res, next));

routes.get('/jobs/:id', (req, res, next) => new RecruitCRMService().getJob(req, res, next));

export default routes;
