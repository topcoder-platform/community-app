/**
 * Mock version of Terms service. To be used both for Jest testing, and for
 * manual testing inside the app (see MOCK_CHALLENGE_TERMS_SERVICE constant
 * in the app config).
 */

import _ from 'lodash';
import { getApiV2 } from 'services/api';

import termsAuth from './data/terms-auth.json';
import termsDocuSignDetails from './data/terms-docu-sign-details.json';
import termsNoAuth from './data/terms-noauth.json';
import termsTopcoderDetails from './data/terms-topcoder-details.json';

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
    const res = _.clone(this.private.tokenV2 ? termsAuth : termsNoAuth);
    res.serverInformation.currentTime = Date.now();
    res.requesterInformation.receivedParams.challengeId
      = _.toString(challengeId);
    return Promise.resolve(res);
  }

  getTermDetails(termId) {
    _.noop(this);
    let res;
    switch (termId) {
      case 21153:
        res = _.clone(termsDocuSignDetails);
        break;
      case 21193:
        res = _.clone(termsTopcoderDetails);
        break;
      default: throw new Error('Unknown termId!');
    }
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
      recipientViewUrl: `/api/mock/docu-sign?returnUrl=${returnUrl}`,
    });
  }

  agreeTerm(termId) {
    _.noop(termId, this);

    /* TODO: It has not been tracked explicitely, what is the response of
     * the real api here. It sure contains "success" field, and this is
     * the only thing we need for our purposes now. However, it might also
     * have another useful datafields. This should be explored. */
    return Promise.resolve({ success: true });
  }
}

/**
 * Returns a new or existing challenges service.
 * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
 * @return {Challenges} Challenges service object
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
