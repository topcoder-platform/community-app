import { downloadSubmissions } from 'services/submissions';
import { compressFiles, getExtensionFromMime } from 'utils/files';

/**
 * Download one submission artifact, or package a list into a single ZIP.
 * Used by MM history and My Submissions for individual and Download all actions.
 * @param {String} tokenV3 Member token authorizing each artifact request.
 * @param {String} submissionId Submission whose artifacts should be downloaded.
 * @param {String|String[]} artifactIds One artifact ID or the visible artifact IDs.
 * @returns {Promise<void>} Resolves after the browser download starts.
 * @throws {Error} Rejects if an artifact request fails; no partial archive is saved.
 */
export default async function downloadArtifacts(tokenV3, submissionId, artifactIds) {
  const ids = Array.isArray(artifactIds) ? artifactIds : [artifactIds];
  if (!ids.length) return;
  const files = await Promise.all(ids.map(async (artifactId) => {
    const blob = await downloadSubmissions(tokenV3, submissionId, artifactId);
    return new File([blob], `${artifactId}.${getExtensionFromMime(blob.type)}`, { type: blob.type });
  }));
  if (Array.isArray(artifactIds)) {
    await new Promise(resolve => compressFiles(files, `submission-artifacts-${submissionId}.zip`, resolve));
    return;
  }
  const url = window.URL.createObjectURL(files[0]);
  const link = document.createElement('a');
  link.href = url;
  link.download = `submission-${submissionId}-${files[0].name}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
