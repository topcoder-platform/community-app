/**
 * Endpoint controllers.
 */

import _ from 'lodash';
import { services } from 'topcoder-react-lib';

import {
  getSubmissions,
  getSubmissionInformation,
} from '../services/submissions';
import { assert, joi } from '../utils/errors';

/**
 * Array of TC user roles, who can see details of any submissions from all
 * challenges.
 */
const ADMIN_USER_ROLES = [
  'administrator',
];

/**
 * Array of TC user roles on a specific challenge, which allow to see all
 * submissions information.
 */
const CHALLENGE_MANAGER_ROLES = [
  'Copilot',
  'Manager',
];

/**
 * Assuming that `req` is an authorized request, gets roles of the authorized
 * user in the specified challenge.
 * @param {Object} req
 * @param {Number|String} challengeId
 */
async function getUserRolesInChallenge(req, challengeId) {
  const token = req.headers.authorization.match(/Bearer (.*)/)[1];
  const service = services.challenge.getService(token);
  return service.getUserRolesInChallenge(challengeId);
}

/**
 * Returns submission normalized for a user with the specified roles in
 * the challenge these submissions belong to.
 *
 * Beware, it mutates `submission` object.s
 *
 * @param {Object} submission
 * @param {String[]} userRoles
 */
function normalizeSubmission(submission, userRoles) {
  /* eslint-disable no-param-reassign */
  if (!_.intersection(userRoles, CHALLENGE_MANAGER_ROLES).length) {
    if (submission.review) {
      submission.review = submission.review.map((it) => {
        if (it && it.metadata) it.metadata = { public: it.metadata.public };
        return it;
      });
    }
  }
  /* eslint-enable no-param-reassign */
}

export async function getSubmissionsController(req, res, next) {
  try {
    assert(req.query, getSubmissionsController.querySchema);
    const { challengeId } = req.query;
    const submissions = await getSubmissions(challengeId);
    res.json(submissions);
  } catch (error) {
    next(error);
  }
}

getSubmissionsController.querySchema = joi.object({
  challengeId: joi.number(),
}).required();

export async function getSubmissionInfoController(req, res, next) {
  try {
    assert(req.params, getSubmissionInfoController.paramsSchema);
    const { submissionId } = req.params;

    const submission = await getSubmissionInformation(submissionId);

    let userRoles = _.get(req.authUser, 'payload.roles', []);
    /* If user does not have a global admin role, who can see any challenges,
     * then we need to check user roles on this specific challenge, and act
     * accordingly. */
    if (!_.intersection(userRoles, ADMIN_USER_ROLES).length) {
      userRoles = await getUserRolesInChallenge(req, submission.challengeId);
      normalizeSubmission(submission, userRoles);
    }

    res.json(submission);
  } catch (error) {
    next(error);
  }
}

getSubmissionInfoController.paramsSchema = joi.object({
  submissionId: joi.string().required(),
}).required();
