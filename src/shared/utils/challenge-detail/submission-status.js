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

export function getSubmissionReviewSummations(submission) {
  return collectReviewSummations(submission);
}

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

  return {
    hasReviewSummation,
    isAccepted,
  };
}

export default {
  getSubmissionStatus,
  getSubmissionReviewSummations,
};
