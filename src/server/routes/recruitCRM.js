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
// routes.use(cors());
// routes.options('*', cors());

routes.options('/jobs', cors());
routes.get('/jobs', cors(), (req, res, next) => new RecruitCRMService().getAllJobs(req, res, next));

routes.options('/jobs/cache', cors());
routes.get('/jobs/cache', cors(), (req, res, next) => new RecruitCRMService().getJobsCacheStats(req, res, next));

routes.options('/jobs/cache/flush', cors());
routes.get('/jobs/cache/flush', cors(), (req, res, next) => authenticator(authenticatorOptions)(req, res, next), (req, res, next) => new RecruitCRMService().getJobsCacheFlush(req, res, next));

routes.options('/jobs/search', cors());
routes.get('/jobs/search', cors(), (req, res, next) => new RecruitCRMService().getJobs(req, res, next));

routes.options('/jobs/:id', cors());
routes.get('/jobs/:id', cors(), (req, res, next) => new RecruitCRMService().getJob(req, res, next));

const applyOptions = {
  origin: true,
  methods: ['POST'],
  credentials: true,
  maxAge: 3600,
  allowedHeaders: ['Content-Type', 'Authorization'],
};
routes.options('/jobs/:id/apply', cors(applyOptions));
routes.post('/jobs/:id/apply', cors(applyOptions), (req, res, next) => authenticator(authenticatorOptions)(req, res, next), upload.single('resume'), (req, res, next) => new RecruitCRMService().applyForJob(req, res, next));

routes.options('/candidates/search', cors());
routes.get('/candidates/search', cors(), (req, res, next) => new RecruitCRMService().searchCandidates(req, res, next));
// new router added
routes.options('/profile', cors());
routes.get('/profile', cors(), (req, res, next) => authenticator(authenticatorOptions)(req, res, next), (req, res, next) => new RecruitCRMService().getProfile(req, res, next));
routes.post('/profile', cors(), (req, res, next) => authenticator(authenticatorOptions)(req, res, next), upload.single('resume'), (req, res, next) => new RecruitCRMService().updateProfile(req, res, next));

routes.options('/taasjobs', cors());
routes.get('/taasjobs', cors(), (req, res, next) => new RecruitCRMService().getJobsFromTaas(req, res, next));

export default routes;
