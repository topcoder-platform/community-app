/**
 * Mock version of Terms service. To be used both for Jest testing, and for
 * manual testing inside the app (see MOCK_TERMS_SERVICE constant
 * in the app config).
 *
 * NOTE: At the moment this mock does not care much about authorization
 * (i.e. the presence of auth token), as the real backend api acts a bit
 * surprising and non-intuitive at the moment, so it is a bit difficult
 * to imitate it exactly.
 */

import _ from 'lodash';
import { getApiV2 } from 'services/api';

import termsAuth from './data/terms-auth.json';
import termsDocuSignDetails from './data/terms-docu-sign-details.json';
import termsNoAuth from './data/terms-noauth.json';
import termsReviewerDetails from './data/terms-reviewer-details.json';
import termsTopcoderDetails from './data/terms-topcoder-details.json';

let reviewTermsAgreed;

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
   * Mock of getChallengeTerms(..) method.
   * The second argument is optional. If present, it should be an array of
   * boolean values, and it will override acceptance status of terms read
   * from the JSON data file.
   * @param {String} challengeId
   * @param {Array} agreed Optional.
   */
  getChallengeTerms(challengeId, agreed) {
    const res = _.clone(this.private.tokenV2 ? termsAuth : termsNoAuth);
    res.serverInformation.currentTime = Date.now();
    res.requesterInformation.receivedParams.challengeId
      = _.toString(challengeId);
    if (this.private.tokenV2 && _.isArray(agreed)) {
      for (let i = 0; i < Math.min(agreed.length, res.terms.length); i += 1) {
        res.terms[i].agreed = agreed[i];
      }
    }
    return Promise.resolve(res);
  }

  /**
   * Mock of getCommunityTerms(..) method.
   *
   * @param {String} communityId community id
   * @param {String} tokenV3     auth token V3
   * @param {Array}  agreed      Optional. If present, it should be an array of
   *                             boolean values, and it will override acceptance
   *                             status of terms read from the JSON data file.
   *
   * @return {Promise} resolves to the list of mocked terms
   */
  getCommunityTerms(challengeId, tokenV3, agreed) {
    const res = _.clone(this.private.tokenV2 ? termsAuth : termsNoAuth);
    res.serverInformation.currentTime = Date.now();
    if (this.private.tokenV2 && _.isArray(agreed)) {
      for (let i = 0; i < Math.min(agreed.length, res.terms.length); i += 1) {
        res.terms[i].agreed = agreed[i];
        delete res.terms[i].text;
      }
    }
    return Promise.resolve(res);
  }

  /**
   * Mock of getTermDetails(..) method.
   * In the case of Topcoder challenge terms there is "agreed" field in the
   * response. If the second argument is passed into this method, it will
   * override the value of this field from JSON file with mock data.
   * @param {Number} termId
   * @param {Boolean} agreed Optional.
   */
  getTermDetails(termId, agreed) {
    _.noop(this);
    let res;
    switch (termId) {
      case 20704:
        // eslint-disable-next-line
        agreed = reviewTermsAgreed;
        res = _.clone(termsReviewerDetails);
        break;
      case 21153:
        res = _.clone(termsDocuSignDetails);
        break;
      case 21193:
      case 21194:
        res = _.clone(termsTopcoderDetails);
        break;
      default: throw new Error(`Unknown termId '${termId}'!`);
    }
    if (!_.isUndefined(agreed)) res.agreed = agreed;
    res.serverInformation.currentTime = Date.now();
    res.termsOfUseId = termId;
    res.requesterInformation.receivedParams.termsOfUseId =
      _.toString(termId);
    return Promise.resolve(res);
  }

  getDocuSignUrl(templateId, returnUrl) {
    _.noop(this);

    /* TODO: It has not been tracked explicitely, what is the response of
     * the real api here. It sure contains "recipientViewUrl", and this is
     * the only thing we need for our purposes now. However, it might also
     * have another useful datafields. This should be explored. */
    return Promise.resolve({
      recipientViewUrl: `/community-app-assets/api/mock/docu-sign?returnUrl=${returnUrl}`,
    });
  }

  agreeTerm(termId) {
    _.noop(termId, this);

    if (termId === 20704) {
      reviewTermsAgreed = true;
    }

    /* TODO: It has not been tracked explicitely, what is the response of
     * the real api here. It sure contains "success" field, and this is
     * the only thing we need for our purposes now. However, it might also
     * have another useful datafields. This should be explored. */
    return Promise.resolve({ success: true });
  }
}

/**
 * Returns a new or existing terms service.
 * @param  {String} tokenV3 Optional. Auth token for Topcoder API v3.
 * @return {Object} Terms service object
 */
let lastInstance = null;
export function getService(tokenV2) {
  /* eslint-disable no-console */
  console.error(`WARNING:
    Mock version of DocuSign service is used! Should you see this message in
    production, contact support as soon as possible!`);
  /* eslint-enable no-console */
  if (!lastInstance || (tokenV2 && lastInstance.private.tokenV2 !== tokenV2)) {
    lastInstance = new TermsService(tokenV2);
  }
  return lastInstance;
}

/* Using default export would be confusing in this case. */
export default undefined;
