/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */

/**
 * This service provides Challenge related operations
 * @author TCSCODER
 * @version 1.0
 */
/* eslint no-param-reassign: ["error", { "props": false }] */

import _ from 'lodash';
import Joi from 'joi';
import models from '../models';
import helper from '../common/helper';
import errors from '../common/errors';

const Challenge = models.Challenge;
const Competitor = models.Competitor;
const ChallengeCompetitor = models.ChallengeCompetitor;

const ChallengeSchema = Joi.object().keys({
  id: Joi.number().integer().min(1).required(),
  type: Joi.string().max(20),
  title: Joi.string().max(150),
  description: Joi.string().max(1000),
  competitors: Joi.array().items(Joi.object().keys({
    handle: Joi.string().max(30).required(),
    name: Joi.string().max(100),
  })),
});

/**
 * creates the competitors for a challenge.
 * @param {Integer} challengeId the challenge id
 * @param {Array} competitors the list of competitors
 */
async function handleChallengeCompetitors(challengeId, competitors) {
  if (competitors) {
    // Remove any potential connection from the challenge to competitors
    // This is neeeded in case competitors are updated.
    await ChallengeCompetitor.destroy({ where: { challengeId } });

    _.each(competitors, async (competitor) => {
      let existingCompetitor = await Competitor.findOne({ where: { handle: competitor.handle } });
      if (!existingCompetitor) {
        existingCompetitor = await Competitor.create(competitor);
      }

      await ChallengeCompetitor.create({
        challengeId,
        handle: existingCompetitor.handle,
      });
    });
  }
}

/**
 * Create a Challenge
 * @param {Object} challenge the challenge
 * @returns {Object} the saved challenge
 */
async function create(challenge) {
  const existingChallenge = await Challenge.findById(challenge.id);
  if (existingChallenge) {
    throw new errors.BadRequestError(`Challenge with [id: ${challenge.id}] already exists.`);
  }

  const newChallenge = await Challenge.create(challenge);
  handleChallengeCompetitors(newChallenge.id, challenge.competitors);

  return newChallenge;
}

create.schema = { challenge: ChallengeSchema };

/**
 * Gets a challenge
 * @param {Integer} id the challenge id
 * @returns {Object} the challenge
 */
function get(id) {
  return helper.ensureExists(Challenge, {
    where: { id },
    include: [{ model: models.Submission, include: [{ all: true }] }, {
      model: Competitor, through: { attributes: [] },
    }],
  }, true);
}

get.schema = {
  id: Joi.number().integer().min(1),
};

/**
 * Delete challenge
 * @param {Integer} id the challenge id
 */
function remove(id) {
  Challenge.destroy({ where: { id } });
}

remove.schema = get.schema;

/**
 * service to update challenge
 * @param {Integer} id the challenge id
 * @param {Object} the challenge
 * @returns {Object} the challenge
 */
async function update(id, challenge) {
  const existingChallenge = await helper.ensureExists(Challenge, id, true);

  _.extend(existingChallenge, challenge);
  handleChallengeCompetitors(id, existingChallenge.competitors);

  return existingChallenge.save();
}

update.schema = {
  id: Joi.number().integer().min(1),
  challenge: ChallengeSchema,
};

module.exports = {
  create,
  get,
  update,
  remove,
};
