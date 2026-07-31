/**
 * The routes related to RecruitCRM.io integration
 */

import express from 'express';
import { rateLimit } from 'express-rate-limit';
import RecruitCRMService from '../services/recruitCRM';
import {
  configuredJwtAuthenticator,
  protectedCorsOptions,
} from './authentication';

const cors = require('cors');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 8000000,
    fieldSize: 512 * 1024,
    fields: 8,
    files: 1,
    parts: 10,
  },
});
const routes = express.Router();

export const sensitiveRouteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

// Enables CORS on those routes according config above
// ToDo configure CORS for set of our trusted domains
// routes.use(cors());
// routes.options('*', cors());

routes.options('/jobs', cors());
routes.get('/jobs', cors(), (req, res, next) => new RecruitCRMService().getAllJobs(req, res, next));

routes.options('/jobs/cache', cors());
routes.get('/jobs/cache', cors(), (req, res, next) => new RecruitCRMService().getJobsCacheStats(req, res, next));

routes.options('/jobs/cache/flush', cors(protectedCorsOptions));
routes.get('/jobs/cache/flush', cors(protectedCorsOptions), sensitiveRouteLimiter, configuredJwtAuthenticator, (req, res, next) => new RecruitCRMService().getJobsCacheFlush(req, res, next));

routes.options('/jobs/search', cors());
routes.get('/jobs/search', cors(), (req, res, next) => new RecruitCRMService().getJobs(req, res, next));

routes.options('/jobs/:id', cors());
routes.get('/jobs/:id', cors(), (req, res, next) => new RecruitCRMService().getJob(req, res, next));

const applyOptions = {
  ...protectedCorsOptions,
  methods: ['POST'],
};
routes.options('/jobs/:id/apply', cors(applyOptions));
routes.post('/jobs/:id/apply', cors(applyOptions), sensitiveRouteLimiter, configuredJwtAuthenticator, upload.single('resume'), (req, res, next) => new RecruitCRMService().applyForJob(req, res, next));

routes.options('/candidates/search', cors());
routes.get('/candidates/search', cors(), (req, res, next) => new RecruitCRMService().searchCandidates(req, res, next));
// new router added
routes.options('/profile', cors(protectedCorsOptions));
routes.get('/profile', cors(protectedCorsOptions), sensitiveRouteLimiter, configuredJwtAuthenticator, (req, res, next) => new RecruitCRMService().getProfile(req, res, next));
routes.post('/profile', cors(protectedCorsOptions), sensitiveRouteLimiter, configuredJwtAuthenticator, upload.single('resume'), (req, res, next) => new RecruitCRMService().updateProfile(req, res, next));

routes.options('/taasjobs', cors());
routes.get('/taasjobs', cors(), (req, res, next) => new RecruitCRMService().getJobsFromTaas(req, res, next));

export default routes;
