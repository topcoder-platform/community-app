const SUBMISSION_LIMIT_METADATA_NAME = 'submissionLimit';

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
