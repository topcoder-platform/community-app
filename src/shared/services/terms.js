/**
 * This module provides a service for convenient manipulation with Topcoder
 * challenges' terms via TC API.
 */

import _ from 'lodash';
import { getApiV2 } from './api';

class TermsService {
  /**
   * @param {String} tokenV2 Optional. Auth token for Topcoder API v2.
   */
  constructor(tokenV2) {
    this.private = {
      api: getApiV2(tokenV2),
      tokenV2,
    };
  }

  getTerms(challengeId) {
    let registered = false;
    return this.private.api.get(`/terms/${challengeId}?role=Submitter`)
      .then(res => res.json())
      .then((res) => {
        if (res.error) {
          if (res.error.details === 'You are already registered for this challenge.') {
            registered = true;
          }
          return this.private.api.get(`/terms/${challengeId}?role=Submitter&noauth=true`)
            .then((resp) => {
              if (resp.ok) {
                return resp.json().then((result) => {
                  if (registered) {
                    // eslint-disable-next-line no-param-reassign
                    _.forEach(result.terms, (t) => { t.agreed = true; });
                  }
                  return result;
                });
              }
              return new Error(resp.statusText);
            });
        }
        return res;
      });
  }

  getTermDetails(termId) {
    return this.private.api.get(`/terms/detail/${termId}`)
      .then(res => (res.ok ? res.json() : new Error(res.statusText)));
  }

  getDocuSignUrl(templateId, returnUrl) {
    return this.private.api.post(`/terms/docusign/viewURL?templateId=${templateId}&returnUrl=${returnUrl}`)
      .then(res => (res.ok ? res.json() : new Error(res.statusText)));
  }

  agreeTerm(termId) {
    return this.private.api.post(`/terms/${termId}/agree`)
      .then(res => (res.ok ? res.json() : new Error(res.statusText)));
  }
}

/**
 * Returns a new or existing challenges service.
 * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
 * @return {Challenges} Challenges service object
 */
let lastInstance = null;
export function getService(tokenV2) {
  if (!lastInstance || (tokenV2 && lastInstance.private.tokenV2 !== tokenV2)) {
    lastInstance = new TermsService(tokenV2);
  }
  return lastInstance;
}

/* Using default export would be confusing in this case. */
export default undefined;
