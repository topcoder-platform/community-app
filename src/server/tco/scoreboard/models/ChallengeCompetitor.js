/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */

/**
 * Schema for ChallengeCompetitor
 * @author TCSCODER
 * @version 1.0
 */
import Sequelize from 'sequelize';

module.exports = (sequelize) => {
  const model = sequelize.define('challengeCompetitor',
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      challengeId: { type: Sequelize.INTEGER, allowNull: false },
      handle: { type: Sequelize.STRING(30), allowNull: false },
    },
    {
      timestamps: false,
    },
  );
  model.modelName = 'ChallengeCompetitor';
  return model;
};
