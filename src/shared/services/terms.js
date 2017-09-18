/**
 * This module provides a service for convenient manipulation with Topcoder
 * challenges' terms via TC API.
 */

import _ from 'lodash';
import config from 'utils/config';
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

  /**
   * get all terms of specified challenge
   * @param  {Number|String} challengeId id of the challenge
   * @return {Promise}       promise of the request result
   */
  getTerms(challengeId) {
    if (this.private.tokenV2) {
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
    return this.private.api.get(`/terms/${challengeId}?role=Submitter&noauth=true`)
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
        return new Error(resp.statusText);
      });
  }

  /**
   * get details of specified term
   * @param  {Number|String} termId id of the term
   * @return {Promise}       promise of the request result
   */
  getTermDetails(termId) {
    return this.private.api.get(`/terms/detail/${termId}`)
      .then(res => (res.ok ? res.json() : new Error(res.statusText)));
  }

  /**
   * generate the url of DocuSign term
   * @param  {Number|String} templateId id of the term's template
   * @param  {String}        returnUrl  callback url after finishing signing
   * @return {Promise}       promise of the request result
   */
  getDocuSignUrl(templateId, returnUrl) {
    return this.private.api.post(`/terms/docusign/viewURL?templateId=${templateId}&returnUrl=${returnUrl}`)
      .then(res => (res.ok ? res.json() : new Error(res.statusText)));
  }

  /**
   * Agree a term
   * @param  {Number|String} termId id of the term
   * @return {Promise}       promise of the request result
   */
  agreeTerm(termId) {
    return this.private.api.post(`/terms/${termId}/agree`)
      .then(res => (res.ok ? res.json() : new Error(res.statusText)));
  }
}

/**
 * Returns a new or existing terms service.
 * @param {String} tokenV2 Optional. Auth token for Topcoder API v2.
 * @return {TermsService} Terms service object
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

/* Because of Topcoder backend restrictions, it is not straightforward to test
 * terms-related functionality in any other way than just providing an option to
 * run the app against mock terms service. */
if (config.MOCK_CHALLENGE_TERMS_SERVICE) {
  /* eslint-disable global-require */
  module.exports = require('./__mocks__/terms');
  /* eslint-enable global-require */
} else {
  module.exports.getService = getService;
}
