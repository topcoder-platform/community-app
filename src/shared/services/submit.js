import { getApiV2, getApiV3 } from './api';

/**
 * Services to handle submissions.
 */
class SubmitService {
  constructor(tokenV3, tokenV2) {
    this.private = {
      api: getApiV3(tokenV3),
      apiV2: getApiV2(tokenV2),
      tokenV2,
      tokenV3,
    };
  }

  startSubmissionDevelop(body, challengeId, track) {
    const url = track !== 'DESIGN' ?
      `/develop/challenges/${challengeId}/upload` :
      `/design/challenges/${challengeId}/submit`;
    return this.private.apiV2.customFetch(url, {
      method: 'POST',
      body,
    }).then(
      res => res.json(),
    );
  }
}

let lastInstance = null;
export function getService(tokenV3, tokenV2) {
  if (!lastInstance || lastInstance.tokenV3 !== tokenV3
  || lastInstance.tokenV2 !== tokenV2) {
    lastInstance = new SubmitService(tokenV3, tokenV2);
  }
  return lastInstance;
}

export default undefined;
