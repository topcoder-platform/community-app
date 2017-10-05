/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */
/**
 * Contains all routes for the scoreboard API
 *
 * @author TCSCODER
 * @version 1.1
 */

import auth from './common/auth';

module.exports = {
  '/challenges/:id': {
    put: { controller: 'ChallengeController', method: 'update', middleware: [auth()] },
    get: { controller: 'ChallengeController', method: 'get' },
    delete: { controller: 'ChallengeController', method: 'remove', middleware: [auth()] },
  },
  '/challenges': {
    post: { controller: 'ChallengeController', method: 'create', middleware: [auth()] },
  },
  '/submissions/:id': {
    put: { controller: 'SubmissionController', method: 'update', middleware: [auth()] },
    get: { controller: 'SubmissionController', method: 'get' },
    delete: { controller: 'SubmissionController', method: 'remove', middleware: [auth()] },
  },
  '/submissions': {
    post: { controller: 'SubmissionController', method: 'create', middleware: [auth()] },
  },
};
