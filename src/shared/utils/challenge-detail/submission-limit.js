const SUBMISSION_LIMIT_METADATA_NAME = 'submissionLimit';
const CHECKPOINT_SUBMISSION_TYPE = 'CHECKPOINT_SUBMISSION';
const CONTEST_SUBMISSION_TYPE = 'CONTEST_SUBMISSION';
const FINAL_FIX_SUBMISSION_TYPE = 'STUDIO_FINAL_FIX_SUBMISSION';
const SUBMISSION_PHASE_NAMES = ['Checkpoint Submission', 'Submission'];

/**
 * Converts a metadata value to a positive integer submission limit.
 *
 * @param {*} value Raw count value.
 * @return {?Number} A positive integer, or null when the value is not a valid limit.
 */
function toPositiveInteger(value) {
  const numericValue = Number(value);

  if (!Number.isInteger(numericValue) || numericValue < 1) {
    return null;
  }

  return numericValue;
}

/**
 * Checks whether a legacy metadata flag is explicitly enabled.
 *
 * @param {*} value Raw flag value.
 * @return {Boolean} Whether the value represents true.
 */
function isTrue(value) {
  return value === true || value === 'true';
}

/**
 * Extracts a limited count from parsed submission-limit metadata.
 *
 * Explicit unlimited and disabled-limit payloads remain unlimited. A count with no legacy flags
 * is accepted for compatibility with older metadata shapes.
 *
 * @param {*} value Parsed metadata value.
 * @return {?Number} The configured submission limit, or null for unlimited/invalid metadata.
 */
function extractSubmissionLimit(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return toPositiveInteger(value);
  }

  const count = toPositiveInteger(value.count);
  const hasLimitFlag = Object.prototype.hasOwnProperty.call(value, 'limit');
  const hasUnlimitedFlag = Object.prototype.hasOwnProperty.call(value, 'unlimited');

  if (isTrue(value.limit)) {
    return count;
  }

  if (isTrue(value.unlimited) || hasLimitFlag || hasUnlimitedFlag) {
    return null;
  }

  return count;
}

/**
 * Reads the configured submission limit from challenge metadata.
 *
 * Supports the current JSON-string contract and older numeric values. Missing, malformed, and
 * unlimited metadata resolve to null so callers can use the Unlimited display/behavior.
 *
 * @param {Array<Object>} metadata Challenge metadata entries.
 * @return {?Number} The positive submission limit, or null when submissions are unlimited.
 */
export function getSubmissionLimit(metadata) {
  if (!Array.isArray(metadata)) {
    return null;
  }

  const submissionLimit = metadata.find(entry => (
    entry && entry.name === SUBMISSION_LIMIT_METADATA_NAME
  ));

  if (!submissionLimit) {
    return null;
  }

  const rawValue = submissionLimit.value;

  if (typeof rawValue !== 'string') {
    return extractSubmissionLimit(rawValue);
  }

  const normalizedValue = rawValue.trim();

  if (!normalizedValue) {
    return null;
  }

  try {
    return extractSubmissionLimit(JSON.parse(normalizedValue));
  } catch (error) {
    return toPositiveInteger(normalizedValue);
  }
}

/**
 * Resolves the submission type created by the currently open design phase.
 *
 * This mirrors the submission form's phase precedence so submission-limit checks and the
 * eventual submission request cannot classify the same upload differently.
 *
 * @param {Array<Object>} phases Challenge phases.
 * @return {String} V6 submission type for the active submission phase.
 * @throws Does not throw; challenges without an open submission phase use contest submissions.
 */
export function getActiveSubmissionType(phases) {
  const challengePhases = Array.isArray(phases) ? phases : [];
  const checkpoint = challengePhases.find(phase => (
    phase && phase.name === 'Checkpoint Submission'
  ));
  const submission = challengePhases.find(phase => (
    phase && phase.name === 'Submission'
  ));
  const finalFix = challengePhases.find(phase => (
    phase && phase.name === 'Final Fix'
  ));

  if (checkpoint && checkpoint.isOpen) {
    return CHECKPOINT_SUBMISSION_TYPE;
  }

  if (checkpoint && !checkpoint.isOpen && submission && submission.isOpen) {
    return CONTEST_SUBMISSION_TYPE;
  }

  if (finalFix && finalFix.isOpen) {
    return FINAL_FIX_SUBMISSION_TYPE;
  }

  return CONTEST_SUBMISSION_TYPE;
}

/**
 * Converts current and legacy submission type values to the V6 API representation.
 *
 * @param {*} value Raw `type` or legacy `submissionType` value.
 * @return {String} Normalized submission type, or an empty string when unavailable.
 * @throws Does not throw.
 */
function normalizeSubmissionType(value) {
  const normalizedValue = String(value || '')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_');

  if (normalizedValue === 'CHECKPOINT') {
    return CHECKPOINT_SUBMISSION_TYPE;
  }

  if (normalizedValue === 'CONTEST' || normalizedValue === 'SUBMISSION') {
    return CONTEST_SUBMISSION_TYPE;
  }

  if (normalizedValue === 'FINAL_FIX' || normalizedValue === 'STUDIO_FINAL_FIX') {
    return FINAL_FIX_SUBMISSION_TYPE;
  }

  return normalizedValue;
}

/**
 * Checks whether a submission was created by the currently open submission phase.
 *
 * Submitters may only remove a submission while the phase that produced it is still open. A
 * checkpoint submission therefore stops being deletable as soon as the Checkpoint Submission
 * phase ends, even though the Submission phase opens right after it, and nothing is deletable
 * once every submission phase is closed (screening, review, appeals, ...).
 *
 * @param {Object} submission Member submission, using the V6 `type` or legacy `submissionType`.
 * @param {Array<Object>} phases Challenge phases.
 * @return {Boolean} Whether the submission belongs to the currently open submission phase.
 * @throws Does not throw; missing submissions or phases resolve to false.
 */
export function belongsToActiveSubmissionPhase(submission, phases) {
  const challengePhases = Array.isArray(phases) ? phases : [];
  const hasOpenSubmissionPhase = challengePhases.some(phase => (
    phase && phase.isOpen && SUBMISSION_PHASE_NAMES.includes(phase.name)
  ));

  if (!submission || !hasOpenSubmissionPhase) {
    return false;
  }

  return normalizeSubmissionType(submission.type || submission.submissionType)
    === getActiveSubmissionType(challengePhases);
}

/**
 * Checks whether concept submission limits apply to a V6 submission type.
 *
 * Checkpoint and contest submissions are limited independently. Final-fix submissions belong to
 * winning-submission fulfillment and must remain available regardless of the concept limit.
 *
 * @param {String} submissionType V6 submission type.
 * @return {Boolean} Whether submission-limit metadata applies to the type.
 * @throws Does not throw.
 */
export function isSubmissionLimitType(submissionType) {
  return submissionType === CHECKPOINT_SUBMISSION_TYPE
    || submissionType === CONTEST_SUBMISSION_TYPE;
}

/**
 * Counts submissions belonging to the currently active submission phase.
 *
 * Checkpoint and contest submissions have independent limits. Final fixes are excluded. Both the
 * current V6 `type` property and the legacy `submissionType` property are supported.
 *
 * @param {Array<Object>} submissions Member submissions for the challenge.
 * @param {Array<Object>} phases Challenge phases.
 * @return {Number} Number of submissions matching the active phase type.
 * @throws Does not throw; invalid submission collections count as empty.
 */
export function getActiveSubmissionCount(submissions, phases) {
  if (!Array.isArray(submissions)) {
    return 0;
  }

  const activeSubmissionType = getActiveSubmissionType(phases);

  if (!isSubmissionLimitType(activeSubmissionType)) {
    return 0;
  }

  return submissions.filter(submission => (
    submission
    && normalizeSubmissionType(submission.type || submission.submissionType)
      === activeSubmissionType
  )).length;
}

/**
 * Checks whether the member has reached the configured limit for the active submission phase.
 *
 * @param {Array<Object>} metadata Challenge metadata entries.
 * @param {Array<Object>} submissions Member submissions for the challenge.
 * @param {Array<Object>} phases Challenge phases.
 * @return {Boolean} Whether the active phase has no submission slots remaining.
 * @throws Does not throw; missing or invalid limits are treated as unlimited.
 */
export function hasReachedSubmissionLimit(metadata, submissions, phases) {
  const submissionLimit = getSubmissionLimit(metadata);

  return submissionLimit !== null
    && getActiveSubmissionCount(submissions, phases) >= submissionLimit;
}

/**
 * Builds the message shown when a member has no remaining submission slots.
 *
 * @param {Number} submissionLimit Configured active submission limit.
 * @return {String} Message explaining how the member can replace a submission.
 */
export function getSubmissionLimitReachedMessage(submissionLimit) {
  if (submissionLimit === 1) {
    return 'This challenge allows only one submission, and you\'ve already submitted.'
      + ' To replace it, delete your existing submission first.';
  }

  return `This challenge allows only ${submissionLimit} submissions, and you've already reached that limit.`
    + ' To replace one, delete an existing submission first.';
}

export default getSubmissionLimit;
