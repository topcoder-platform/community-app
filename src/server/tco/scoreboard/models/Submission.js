/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */

/**
 * Schema for Submission, this is like a base class for other types of submissions.
 * @author TCSCODER
 * @version 1.0
 */
import Sequelize from 'sequelize';

module.exports = (sequelize) => {
  const model = sequelize.define('submission',
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      challengeId: { type: Sequelize.INTEGER, require: true },
      handle: { type: Sequelize.STRING(30), require: true },
      // Common fields across submission types can be added here.
    },
    {
      timestamps: false,
    },
  );
  model.modelName = 'Submission';
  return model;
};
