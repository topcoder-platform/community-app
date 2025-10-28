/* eslint-disable import/prefer-default-export */

/**
 * Get submission id of marathon match challenge
 * @param {Array} submissions list of submission
 * @param {String} handle handle
 * @returns String or null
 */
export function getMMSubmissionId(submissions, handle) {
  const filterSubmissions = handle ? submissions.filter(s => s.createdBy === handle) : submissions;
  const sortedSubmissions = filterSubmissions.sort((a, b) => (
    (a.created || a.createdAt) < (b.created || b.createdAt) ? 1 : -1
  ));

  return sortedSubmissions.length > 0 ? sortedSubmissions[0].id : null;
}

/**
 * Get submission id of history submissions
 * @param {Array} submissions list of history submission
 * @returns String or null
 */
export function getSubmissionId(submissions) {
  const filterSubmissions = submissions;
  const sortedSubmissions = filterSubmissions.sort((a, b) => (
    a.submissionTime < b.submissionTime ? 1 : -1));

  return sortedSubmissions.length > 0 ? sortedSubmissions[0].submissionId : null;
}
