/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */

/**
 * This file defines helper methods
 * @author TCSCODER
 * @version 1.0
 */
/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-eval: 0 */

import _ from 'lodash';
import errors from './errors';
/**
 * Check if value is defined or not and throws errors
 * @param {Object} value
 * @param {Object} Model
 * @param {Object|Number} criteria
 * @param {Boolean} throwsNotFound
 * @private
 */
function checkExists(value, Model, criteria, throwsNotFound) {
  if (!value) {
    const normalizedCriteria = _.isObject(criteria) ? JSON.stringify(_.omit(criteria, ['include'])) : 'id:';
    const msg = `${Model.modelName} does not exist with ${normalizedCriteria} ${criteria}`;
    throw throwsNotFound ? new errors.NotFoundError(msg) : new errors.BadRequestError(msg);
  }
}

/**
 * Find a entity matching the given criteria.
 * @param {Object} Model the model to query
 * @param {Object|String|Number} criteria the criteria (if object) or id (if string/number)
 * @return {Object} the entity
 * @private
 */
function findOne(Model, criteria) {
  let query;
  if (_.isObject(criteria)) {
    query = Model.findOne(criteria);
  } else {
    query = Model.findById(criteria);
  }
  return query;
}

/**
 * Ensure entity exists for given criteria. Throw error if no result
 * @param {Object} Model the model to query
 * @param {Object|String|Number} criteria the criteria (if object) or id (if string/number)
 * @param {Boolean} throwsNotFound true to throw NotFoundError, otherwise throw BadRequestError
 * @param {String} paramName the optional name of the parameter to be validated
 * @return {Object} the existed entity
 */
async function ensureExists(Model, criteria, throwsNotFound) {
  const result = await findOne(Model, criteria);
  checkExists(result, Model, criteria, throwsNotFound);
  return result;
}

/**
 * Constructs the sequelize columns given configured fields.
 * @param {Object} columns the existing column definition
 * @param {Array} fields the fields list to add as sequelize columns
 * @returns the columns
 */
function addSequelizeColumns(columns, fields) {
  if (columns && fields) {
    _.each(fields, (field) => {
      columns[field.fieldName] = { type: eval(`const Sequelize = require('sequelize');${field.dbType}`) };
    });
  }

  return columns;
}

/**
 * Constructs the Joi validation schema given configured fields.
 * @param {Object} columns the existing column definition
 * @param {Array} fields the fields list to add as joi validation fields
 * @returns the joi object schema
 */
function addJoiValidation(objectSchema, fields) {
  if (objectSchema && fields) {
    _.each(fields, (field) => {
      objectSchema[field.fieldName] = eval(`const Joi = require('joi');${field.type}`);
    });
  }

  return objectSchema;
}


module.exports = {
  ensureExists,
  addSequelizeColumns,
  addJoiValidation,
};
