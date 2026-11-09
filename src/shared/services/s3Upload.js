import { config } from 'topcoder-react-utils';

/** A single local ZIP, uploaded directly to S3 using Uppy 6. */
export default async function uploadSubmission(file, token, challengeId, onProgress, signal) {
  if (!token) throw new Error('Sign in before uploading a submission.');
  if (!/\.zip$/i.test(file.name)) throw new Error('Choose a ZIP file.');
  if (!file.size || file.size > 500 * 1024 * 1024) throw new Error('Choose a ZIP between 1 byte and 500 MB.');
  const cancelled = () => new DOMException('Upload cancelled.', 'AbortError');
  if (signal.aborted) throw cancelled();
  const apiUrl = config.UPLOADS_API_URL || `${config.API.V6}/uploads/files`;
  const post = async (path, body, requestSignal) => {
    const response = await fetch(`${apiUrl}/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
      signal: requestSignal,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'File upload failed. Please try again.');
    return result;
  };
  const [{ default: Uppy }, { default: AwsS3 }, session] = await Promise.all([
    // Webpack resolves Uppy 6 package exports; the legacy ESLint resolver does not.
    // eslint-disable-next-line import/no-unresolved
    import('@uppy/core'),
    // eslint-disable-next-line import/no-unresolved
    import('@uppy/aws-s3'),
    post('sessions', {
      purpose: 'submission',
      filename: file.name,
      contentType: file.type || 'application/octet-stream',
      size: file.size,
      contextId: challengeId,
    }, signal),
  ]);
  if (signal.aborted) throw cancelled();
  const uppy = new Uppy({
    restrictions: {
      maxNumberOfFiles: 1, allowedFileTypes: ['.zip'], minFileSize: 1, maxFileSize: 500 * 1024 * 1024,
    },
  }).use(AwsS3, {
    generateObjectKey: () => session.key,
    getChunkSize: () => session.partSize,
    // Signing cancellation must remain possible after the UI aborts.
    signRequest: request => post('sign', { ...request, token: session.token }),
  });
  uppy.on('progress', progress => onProgress(Math.min(99, Math.round(progress))));
  let abort;
  try {
    uppy.addFile({ data: file, name: file.name, type: file.type || 'application/octet-stream' });
    const aborted = new Promise((resolve, reject) => {
      abort = () => { uppy.cancelAll(); reject(cancelled()); };
      signal.addEventListener('abort', abort, { once: true });
    });
    const result = await Promise.race([uppy.upload(), aborted]);
    if (!result || result.failed.length) throw new Error((result && result.failed[0].error) || 'File upload failed.');
    onProgress(100);
    return {
      filename: file.name, mimetype: file.type || 'application/zip', size: file.size, key: session.key, container: session.bucket, url: session.url,
    };
  } finally {
    signal.removeEventListener('abort', abort);
    uppy.destroy();
  }
}
