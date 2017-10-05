/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */

/**
 * Schema for challenge
 * @author TCSCODER
 * @version 1.0
 */
import Sequelize from 'sequelize';

module.exports = (sequelize) => {
  const model = sequelize.define('challenge',
    {
      id: { type: Sequelize.INTEGER, primaryKey: true },
      type: { type: Sequelize.STRING(20) },
      title: { type: Sequelize.STRING(150) },
      description: { type: Sequelize.STRING(1000) },
    },
    {
      timestamps: false,
    },
  );
  model.modelName = 'Challenge';
  return model;
};
