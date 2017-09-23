/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */

/**
 * This module contains the logger and validation configuration
 * @author TCSCODER
 * @version 1.0
 */
/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint prefer-rest-params: 0 */

import _ from 'lodash';
import util from 'util';
import Joi from 'joi';
import getParams from 'get-parameter-names';
import logger from 'utils/logger';

/**
 * Log error details with signature
 * @param err the error
 * @param signature the signature
 */
function logFullError(err, signature) {
  if (!err || process.env.NODE_ENV !== 'development') {
    return;
  }
  logger.error(`Error happened in ${signature}`);
  logger.error(util.inspect(err));
}

function logDebug(message) {
  if (!message || process.env.NODE_ENV !== 'development') {
    return;
  }
  logger.log(message);
}


/**
 * Remove invalid properties from the object and hide long arrays
 * @param {Object} obj the object
 * @returns {Object} the new object with removed properties
 * @private
 */
function sanitizeObject(obj) {
  try {
    return JSON.parse(JSON.stringify(obj, (name, value) => {
      // Array of field names that should not be logged
      const removeFields = ['token'];
      if (_.includes(removeFields, name)) {
        return '<removed>';
      }
      if (_.isArray(value) && value.length > 30) {
        return `Array(${value.length})`;
      }
      return value;
    }));
  } catch (e) {
    return obj;
  }
}

/**
 * Convert array with arguments to object
 * @param {Array} params the name of parameters
 * @param {Array} arr the array with values
 * @private
 */
function combineObject(params, arr) {
  const ret = {};
  _.each(arr, (arg, i) => {
    ret[params[i]] = arg;
  });
  return ret;
}

/**
 * Decorate all functions of a service and log debug information if DEBUG is enabled
 * @param {Object} service the service
 */
const decorateWithLogging = function decorateWithLogging(service) {
  _.each(service, (method, name) => {
    const params = method.params || getParams(method);
    service[name] = async function serviceMethodWithLogging() {
      logDebug(`ENTER ${name}`);
      logDebug('input arguments');
      const args = Array.prototype.slice.call(arguments);
      logDebug(util.inspect(sanitizeObject(combineObject(params, args))));
      try {
        const result = await method.apply(this, arguments);
        logDebug(`EXIT ${name}`);
        logDebug('output arguments');
        logDebug(util.inspect(sanitizeObject(result)));
        return result;
      } catch (e) {
        logFullError(e, name);
        throw e;
      }
    };
  });
};

/**
 * Decorate all functions of a service and validate input values
 * and replace input arguments with sanitized result form Joi
 * Service method must have a `schema` property with Joi schema
 * @param {Object} service the service
 */
const decorateWithValidators = function decorateWithValidators(service) {
  _.each(service, (method, name) => {
    if (!method.schema) {
      return;
    }
    const params = Object.keys(method.schema) || getParams(method);
    service[name] = async function serviceMethodWithValidation() {
      const args = Array.prototype.slice.call(arguments);
      const value = combineObject(params, args);
      const normalized = await new Promise((resolve) => {
        Joi.validate(value, method.schema, { abortEarly: false }, (err, val) => {
          if (err) {
            throw err;
          } else {
            resolve(val);
          }
        });
      });
      const newArgs = [];
      // Joi will normalize values
      // for example string number '1' to 1
      // if schema type is number
      _.each(params, (param) => {
        newArgs.push(normalized[param]);
      });
      return method.apply(this, newArgs);
    };
    service[name].params = params;
  });
};

/**
 * Apply logger and validation decorators
 * @param {Object} service the service to wrap
 */
const buildService = function buildService(service) {
  decorateWithValidators(service);
  decorateWithLogging(service);
};


module.exports = buildService;
