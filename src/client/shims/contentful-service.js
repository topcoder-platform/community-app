/**
 * Browser-only replacement for the server Payload compatibility service.
 * Client-side CMS requests use Community App's same-origin proxy instead.
 */

export function getService() {
  throw new Error('The server CMS compatibility service is unavailable in the browser.');
}

export default { getService };
