/**
 * Resolves the scorecard used by a challenge's manual (member) review.
 *
 * Challenge API exposes the review definition as `challenge.reviewers`. Member reviewers have
 * `isMemberReview: true`, no `aiWorkflowId`, and reference the phase type through `phaseId`.
 */
import { config } from 'topcoder-react-utils';

/** Phase names that carry the final manual review, in priority order. */
const MANUAL_REVIEW_PHASE_NAMES = ['review', 'iterative review'];

/**
 * Collects the phase identifiers for challenge phases with the given name.
 *
 * @param {Array<Object>} phases Challenge phases.
 * @param {String} phaseName Lower-case phase name to match.
 * @return {Array<String>} Phase type ids and phase instance ids for matching phases.
 * @throws Does not throw.
 */
function getPhaseIds(phases, phaseName) {
  return phases
    .filter(phase => phase && String(phase.name || '').trim().toLowerCase() === phaseName)
    .reduce((ids, phase) => ids.concat([phase.phaseId, phase.id]), [])
    .filter(Boolean);
}

/**
 * Finds the scorecard id configured for the challenge's manual review.
 *
 * The Review phase reviewer wins; First2Finish-style challenges fall back to Iterative Review.
 * Screening, approval, and AI reviewers are ignored.
 *
 * @param {Object} challenge Challenge API detail response.
 * @return {String} Manual review scorecard id, or an empty string when none is configured.
 * @throws Does not throw.
 */
export function getManualReviewScorecardId(challenge) {
  const reviewers = challenge && Array.isArray(challenge.reviewers) ? challenge.reviewers : [];
  const phases = challenge && Array.isArray(challenge.phases) ? challenge.phases : [];
  const memberReviewers = reviewers.filter(reviewer => (
    reviewer
    && reviewer.isMemberReview === true
    && !String(reviewer.aiWorkflowId || '').trim()
    && String(reviewer.scorecardId || '').trim()
  ));

  for (let i = 0; i < MANUAL_REVIEW_PHASE_NAMES.length; i += 1) {
    const phaseIds = getPhaseIds(phases, MANUAL_REVIEW_PHASE_NAMES[i]);
    const reviewer = memberReviewers.find(item => phaseIds.includes(item.phaseId));
    if (reviewer) {
      return String(reviewer.scorecardId).trim();
    }
  }

  return '';
}

/**
 * Builds the public Review App URL for the challenge's manual review scorecard.
 *
 * Used by the challenge-details sidebar to render the "Manual: Scorecard Link" review style.
 *
 * @param {Object} challenge Challenge API detail response.
 * @param {String} reviewAppUrl Review App origin; defaults to `config.REVIEW_APP_URL`.
 * @return {String} Scorecard URL, or an empty string when no manual review scorecard exists.
 * @throws Does not throw.
 */
export function getManualReviewScorecardUrl(challenge, reviewAppUrl = config.REVIEW_APP_URL) {
  const scorecardId = getManualReviewScorecardId(challenge);
  if (!scorecardId || !reviewAppUrl) {
    return '';
  }

  return `${String(reviewAppUrl).replace(/\/+$/, '')}/scorecard/${encodeURIComponent(scorecardId)}`;
}

export default getManualReviewScorecardUrl;
