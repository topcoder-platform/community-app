/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */

/**
 * This service provides Submission related operations
 * @author TCSCODER
 * @version 1.0
 */

import _ from 'lodash';
import Joi from 'joi';
import models from '../models';
import helper from '../common/helper';
import codeFields from '../config/submissionCodeFields.json';
import designFields from '../config/submissionDesignFields.json';

const Submission = models.Submission;

// Code specific fields
const submissionCodeSchemaFields = {};
helper.addJoiValidation(submissionCodeSchemaFields, codeFields.fields);
// Design specific fields
const submissionDesignSchemaFields = {};
helper.addJoiValidation(submissionDesignSchemaFields, designFields.fields);

const submissionSchemaFields = {
  challengeId: Joi.number().integer().min(1).required(),
  handle: Joi.string().max(30),
  submissionCode: Joi.object().keys(submissionCodeSchemaFields),
  submissionDesign: Joi.object().keys(submissionDesignSchemaFields),
};

const SubmissionSchema = Joi.object().keys(submissionSchemaFields);

/**
 * Create a submission
 * @param {Object} submission the submission
 * @returns {Object} the saved submission
 */
function create(submission) {
  return Submission.create(submission, { include: [{ all: true }] });
}

create.schema = { submission: SubmissionSchema };

/**
 * Gets a submission
 * @param {Integer} id the submission id
 * @returns {Object} the submission
 */
function get(id) {
  return helper.ensureExists(Submission, { where: { id }, include: [{ all: true }] }, true);
}

get.schema = {
  id: Joi.number().integer().min(1),
};

/**
 * service to update submission
 * @param {Integer} id the submission id
 * @param {Object} the submission
 * @returns {Object} the submission
 */
async function update(id, submission) {
  const existingSubmission = await helper.ensureExists(
    Submission, {
      where: { id },
      include: [{ all: true }],
    },
    true);

  _.merge(existingSubmission, submission);

  if (existingSubmission.submissionCode) {
    existingSubmission.submissionCode.save();
  }
  if (existingSubmission.submissionDesign) {
    existingSubmission.submissionDesign.save();
  }

  return existingSubmission.save({ include: [{ all: true }] });
}

/**
 * Delete submission
 * @param {Integer} id the submission id
 */
function remove(id) {
  Submission.destroy({ where: { id } });
}

remove.schema = get.schema;

module.exports = {
  create,
  get,
  update,
  remove,
};
