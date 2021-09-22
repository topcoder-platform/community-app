/**
 * The routes related to RecruitCRM.io integration
 */

import express from 'express';
import { middleware } from 'tc-core-library-js';
import config from 'config';
import _ from 'lodash';
import RecruitCRMService from '../services/recruitCRM';

const authenticator = middleware.jwtAuthenticator;
const authenticatorOptions = _.pick(config.SECRET.JWT_AUTH, ['AUTH_SECRET', 'VALID_ISSUERS']);
const cors = require('cors');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 8000000,
  },
});
const routes = express.Router();

// Enables CORS on those routes according config above
// ToDo configure CORS for set of our trusted domains
routes.use(cors());
routes.options('*', cors());

routes.get('/jobs', (req, res, next) => new RecruitCRMService().getAllJobs(req, res, next));
routes.get('/jobs/cache', (req, res, next) => new RecruitCRMService().getJobsCacheStats(req, res, next));
routes.get('/jobs/cache/flush', (req, res, next) => authenticator(authenticatorOptions)(req, res, next), (req, res, next) => new RecruitCRMService().getJobsCacheFlush(req, res, next));
routes.get('/jobs/search', (req, res, next) => new RecruitCRMService().getJobs(req, res, next));
routes.get('/jobs/:id', (req, res, next) => new RecruitCRMService().getJob(req, res, next));
routes.post('/jobs/:id/apply', (req, res, next) => authenticator(authenticatorOptions)(req, res, next), upload.single('resume'), (req, res, next) => new RecruitCRMService().applyForJob(req, res, next));
routes.get('/candidates/search', (req, res, next) => new RecruitCRMService().searchCandidates(req, res, next));
// new router added
routes.get('/profile', (req, res, next) => authenticator(authenticatorOptions)(req, res, next), (req, res, next) => new RecruitCRMService().getProfile(req, res, next));
routes.post('/profile', (req, res, next) => authenticator(authenticatorOptions)(req, res, next), upload.single('resume'), (req, res, next) => new RecruitCRMService().updateProfile(req, res, next));
export default routes;
