/**
 * This module provides a service for convenient manipulation with Topcoder
 * challenges' terms via TC API.
 */

import _ from 'lodash';
import config from 'utils/config';
import { getService as getCommunityService } from 'services/communities';
import { getApiV3 } from './api';

/**
 * Private. Handles response from the API.
 * @param {Object} response
 * @return {Promise} On success resolves to the content fetched from the API.
 */
function handleApiResponse(response) {
  if (!response.ok) throw new Error(response.statusText);
  return response.json().then(({ result }) => {
    if (result.status !== 200) throw new Error(result.content);
    return result.content;
  });
}

class TermsService {
  /**
   * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
   */
  constructor(tokenV3) {
    this.private = {
      api: getApiV3(tokenV3),
      tokenV3,
    };
  }

  /**
   * get Submitter terms of specified challenge
   * @param  {Number|String} challengeId id of the challenge
   * @return {Promise} resolves to the list of challenge terms
   */
  getChallengeTerms(challengeId) {
    return this.private.api.get(`/challenges/${challengeId}`)
      .then(handleApiResponse)
      .then((content) => {
        const terms = (content.terms || []).filter(term => term.role === 'Submitter');
        return { terms };
      });
  }

  /**
   * get all terms for community
   *
   * NOTE: As there is no specific endpoint to get community terms by one call
   *       currently we get community term ids from community service and after
   *       we get community terms using term ids list one by one
   *
   * @param {String} communityId community id
   *
   * @return {Promise} resolves to the list of community terms
   */
  getCommunityTerms(communityId) {
    const communityService = getCommunityService(this.private.tokenV3);

    return communityService.getMetadata(communityId).then((meta) => {
      if (meta.terms && meta.terms.length) {
        return Promise.all(meta.terms.map(termId => this.getTermDetails(termId))).then(terms => (
          terms.map(term => _.omit(term, 'text')) // don't include text as it's big and we don't need it for list
        ));
      }

      return [];
    }).then(terms => ({ terms }));
  }

  /**
   * get details of specified term
   * @param  {Number|String} termId id of the term
   * @return {Promise}       promise of the request result
   */
  getTermDetails(termId) {
    // looks like server cache responses, to prevent it we add nocache param with always new value
    const nocache = (new Date()).getTime();
    return this.private.api.get(`/terms/detail/${termId}?nocache=${nocache}`)
      .then(handleApiResponse);
  }

  /**
   * generate the url of DocuSign term
   * @param  {Number|String} templateId id of the term's template
   * @param  {String}        returnUrl  callback url after finishing signing
   * @return {Promise}       promise of the request result
   */
  getDocuSignUrl(templateId, returnUrl) {
    return this.private.api.post('/terms/docusign/viewURL', {
      param: {
        templateId,
        returnUrl,
      },
    }).then(handleApiResponse);
  }

  /**
   * Agree a term
   * @param  {Number|String} termId id of the term
   * @return {Promise}       promise of the request result
   */
  agreeTerm(termId) {
    return this.private.api.post(`/terms/${termId}/agree`)
      .then(handleApiResponse);
  }
}

/**
 * Returns a new or existing terms service.
 * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
 * @return {TermsService} Terms service object
 */
let lastInstance = null;
export function getService(tokenV3) {
  if (!lastInstance || (tokenV3 && lastInstance.private.tokenV3 !== tokenV3)) {
    lastInstance = new TermsService(tokenV3);
  }
  return lastInstance;
}

/* Using default export would be confusing in this case. */
export default undefined;

/* Because of Topcoder backend restrictions, it is not straightforward to test
 * terms-related functionality in any other way than just providing an option to
 * run the app against mock terms service. */
if (config.MOCK_TERMS_SERVICE) {
  /* eslint-disable global-require */
  module.exports = require('./__mocks__/terms');
  /* eslint-enable global-require */
} else {
  module.exports.getService = getService;
}
