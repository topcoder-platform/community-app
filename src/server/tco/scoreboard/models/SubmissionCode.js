/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */

/**
 * Schema for Submission fields when submission type is Code, "inherits" the Submission model.
 * @author TCSCODER
 * @version 1.0
 */
import helper from '../common/helper';
import codeFields from '../config/submissionCodeFields.json';

module.exports = (sequelize) => {
  const columns = {};
  helper.addSequelizeColumns(columns, codeFields.fields);

  const model = sequelize.define('submissionCode',
    columns,
    {
      timestamps: false,
    },
  );
  model.modelName = 'SubmissionCode';
  return model;
};
