/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */

/**
 * This file maps the defined routes to the server app.
 * @author TCSCODER
 * @version 1.0
 */
/* eslint no-param-reassign: ["error", { "props": false }] */

import _ from 'lodash';
import routes from './routes';
import buildService from './common/logger';
import ChallengeService from './services/ChallengeService';
import SubmissionService from './services/SubmissionService';

/**
 * Wrap function to standard express function with catch
 * @param {Function} fn the async function
 * @returns {Function} the wrapped function
 */
function catchAsyncErrors(fn) {
  if (_.isArray(fn)) {
    return fn.map(catchAsyncErrors);
  }

  return (req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) {
      routePromise.catch(err => next(err));
    }
  };
}

/**
 * Service validation and logging
 */
function boostrapServices() {
  buildService(ChallengeService);
  buildService(SubmissionService);
}

/**
 * Configure all routes for express app
 * @param app the express app
 */
module.exports = (app, basePath) => {
  boostrapServices();
  // Load all routes
  _.each(routes, (verbs, path) => {
    _.each(verbs, (def, verb) => {
      let actions = [
        async function (req, res, next) { // eslint-disable-line
          req.signature = `${def.controller}#${def.method}`;
          await next();
        },
      ];
      const controllerPath = `./controllers/${def.controller}`;
      const method = require(controllerPath)[def.method]; // eslint-disable-line

      if (!method) {
        throw new Error(`${def.method} is undefined`);
      }
      if (def.middleware && def.middleware.length > 0) {
        actions = actions.concat(def.middleware);
      }

      actions.push(method);
      app[verb](`${basePath}${path}`, catchAsyncErrors(actions));
    });
  });
};
