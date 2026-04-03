/**
 * Parses a submission score into a finite numeric value.
 *
 * @param {*} value raw score candidate from the API payload.
 * @returns {number|null} finite score value when present, otherwise null.
 */
function toNumericScore(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

/**
 * Resolves the authoritative MM scores for submissions tab rendering.
 * MM provisional score should come from the initial score whenever it exists,
 * because raw provisionalScore values can be stale during queued review updates.
 *
 * @param {Object} submission submission attempt payload.
 * @returns {{ finalScore: number|null, provisionalScore: number|null }} normalized MM scores.
 */
export function getDisplayedMmScores(submission = {}) {
  const initialScore = toNumericScore(submission.initialScore);
  const provisionalScore = toNumericScore(submission.provisionalScore);
  const finalScore = toNumericScore(submission.finalScore);

  return {
    finalScore,
    provisionalScore: initialScore !== null ? initialScore : provisionalScore,
  };
}

export default getDisplayedMmScores;
