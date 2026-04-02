import _ from 'lodash';
import moment from 'moment';

/**
 * Normalizes a displayed score or rank value into a finite number.
 *
 * @param {number|string|null|undefined} value score or rank candidate.
 * @returns {number|null} normalized numeric value, or null when unavailable.
 */
function toFiniteScore(value) {
  if (_.isNil(value) || value === '' || value === '-') {
    return null;
  }

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

/**
 * Returns whether the challenge review phase has already closed.
 *
 * @param {Object} challenge challenge detail payload.
 * @returns {boolean} true when the review phase is no longer open.
 */
export function isReviewPhaseComplete(challenge = {}) {
  return _.some(
    challenge.phases || [],
    phase => phase.name === 'Review' && !phase.isOpen && moment(phase.scheduledStartDate).isBefore(),
  );
}

/**
 * Returns whether Marathon Match final scores or ranks already exist in the
 * loaded submission payload, even if the review phase is still active.
 *
 * @param {Array} mmSubmissions grouped Marathon Match submissions.
 * @returns {boolean} true when at least one final result is available.
 */
export function hasVisibleMmFinalResults(mmSubmissions = []) {
  return _.some(mmSubmissions, (entry) => {
    const finalRank = toFiniteScore(_.get(entry, 'finalRank'));
    if (!_.isNil(finalRank)) {
      return true;
    }

    return _.some(_.get(entry, 'submissions', []), (submission) => {
      const finalScore = toFiniteScore(_.get(submission, 'finalScore'));
      return !_.isNil(finalScore);
    });
  });
}

/**
 * Returns whether Marathon Match final results should be shown on the
 * challenge detail page.
 *
 * @param {Object} challenge challenge detail payload.
 * @param {Array} mmSubmissions grouped Marathon Match submissions.
 * @returns {boolean} true when final results are ready for display.
 */
export function shouldShowFinalMmResults(challenge = {}, mmSubmissions = []) {
  return isReviewPhaseComplete(challenge)
    || hasVisibleMmFinalResults(mmSubmissions);
}
