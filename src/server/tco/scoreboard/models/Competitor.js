/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */

/**
 * Schema for Competitor
 * @author TCSCODER
 * @version 1.0
 */
import Sequelize from 'sequelize';

module.exports = (sequelize) => {
  const model = sequelize.define('competitor',
    {
      handle: { type: Sequelize.STRING(30), primaryKey: true },
      name: { type: Sequelize.STRING(100) },
    },
    {
      timestamps: false,
    },
  );
  model.modelName = 'Competitor';
  return model;
};
