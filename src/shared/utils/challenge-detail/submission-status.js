import _ from 'lodash';

function toArray(value) {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  if (_.isObject(value)) {
    return [value];
  }
  return [];
}

function collectReviewSummations(submission) {
  if (!submission) {
    return [];
  }

  const combined = [];
  toArray(_.get(submission, 'reviewSummations')).forEach(item => combined.push(item));
  toArray(_.get(submission, 'reviewSummation')).forEach(item => combined.push(item));

  return combined;
}

/**
 * Returns whether a submission failed platform virus scanning.
 * The submissions API marks confirmed malware with `virusScan: false`; older
 * records may only expose the quarantine storage path.
 *
 * @param {Object} submission submission attempt shown in challenge details.
 * @returns {Boolean} true when the submission failed virus scanning.
 */
function hasVirusScanFailure(submission) {
  const url = _.toLower(_.toString(_.get(submission, 'url', '')).trim());
  return _.get(submission, 'virusScan') === false
    || url.indexOf('submissions-quarantine/') >= 0;
}

/**
 * Returns whether the raw submission status is a failed state.
 *
 * @param {Object} submission submission attempt shown in challenge details.
 * @returns {Boolean} true when the raw status is failed.
 */
function hasFailedSubmissionStatus(submission) {
  const status = _.toLower(_.toString(_.get(submission, 'status', '')).trim());
  return status === 'failed' || status === 'failure';
}

export function getSubmissionReviewSummations(submission) {
  return collectReviewSummations(submission);
}

/**
 * Builds display status flags for a challenge submission attempt.
 * Review summations indicate accepted scoring; when no accepted summation is
 * present, failed scan or submission states should display as failed instead of
 * staying in the generic preparing state.
 *
 * @param {Object} submission submission attempt shown in challenge details.
 * @returns {{hasReviewSummation: Boolean, isAccepted: Boolean, isFailed: Boolean}} status flags.
 */
export function getSubmissionStatus(submission) {
  const targetIdRaw = _.get(submission, 'submissionId', _.get(submission, 'id', null));
  const targetId = _.toString(targetIdRaw || '').trim();
  const shouldMatchId = Boolean(targetId);

  const reviewSummations = collectReviewSummations(submission).filter((summation) => {
    if (!summation) {
      return false;
    }
    if (!shouldMatchId) {
      return true;
    }
    const summationIdRaw = _.get(summation, 'submissionId', _.get(summation, 'id', null));
    const summationId = _.toString(summationIdRaw || '').trim();
    return summationId && summationId === targetId;
  });

  const hasReviewSummation = reviewSummations.length > 0;

  const isAccepted = reviewSummations.some((summation) => {
    const type = _.toLower(_.toString(_.get(summation, 'type', '') || '').trim());
    const hasFlag = Boolean(
      _.get(summation, 'isProvisional')
      || _.get(summation, 'isFinal')
      || _.get(summation, 'is_provisional')
      || _.get(summation, 'is_final'),
    );
    return hasFlag || type === 'provisional' || type === 'final';
  });

  const isFailed = !isAccepted
    && (hasVirusScanFailure(submission) || hasFailedSubmissionStatus(submission));

  return {
    hasReviewSummation,
    isAccepted,
    isFailed,
  };
}

export default {
  getSubmissionStatus,
  getSubmissionReviewSummations,
};
