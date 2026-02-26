/**
 * Terms specific actions.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import { services } from 'topcoder-react-lib';
import { config } from 'topcoder-react-utils';

const { getService } = services.terms;

/**
 * Payload creator for TERMS/GET_TERMS_DONE action,
 * which fetch terms of the specified entity.
 * @param {Object}  entity       entity object
 * @param {String}  entity.type  entity type ['challenge'||'community']
 * @param {String}  entity.id    entity id
 * @param {Object}  tokens       object with tokenV2 and tokenV3 properties
 * @param {Boolean} mockAgreed   if true, then all terms will be mocked as agreed
 *                               this only makes effect if MOCK_TERMS_SERVICE is true
 *                               and the only purpose of this param is testing terms
 * @return {Promise}
 */
function getTermsDone(entity, tokens, mockAgreed) {
  const service = getService(tokens.tokenV3);
  let termsPromise;

  // if mockAgreed=true passed, then we create an array of 10 true which we pass to the
  // terms service methods.
  // when terms service is mocked by setting MOCK_TERMS_SERVICE=true
  // it will make all terms to have agreed status (actually only first 10 will be agreed,
  // but we will hardly have even more then 3 terms per entity)
  const mockAgreedArray = mockAgreed ? Array(10 + 1).join('1').split('').map(() => true) : [];

  // eslint-disable-next-line no-console
  console.log('Getting terms for entity', entity, 'with mockAgreed', mockAgreed, 'and mockAgreedArray', mockAgreedArray, 'tokens', tokens);

  switch (entity.type) {
    case 'challenge': {
      termsPromise = service.getChallengeTerms(entity.terms, mockAgreedArray);
      break;
    }
    case 'community': {
      termsPromise = service.getCommunityTerms(entity.id, tokens.tokenV3, mockAgreedArray);
      break;
    }
    case 'reviewOpportunity': {
      termsPromise = service.getReviewOpportunityTerms(entity.reviewOpportunityTerms);
      break;
    }
    default:
      throw new Error(`Entity type '${entity.type}' is not supported by getTermsDone.`);
  }

  return termsPromise.then(res => ({ entity, terms: res }));
}

/**
 * Payload creator for TERMS/GET_TERM_DETAILS_INIT action,
 * which marks that we are about to fetch details of the specified term.
 * If any details for another term are currently being fetched,
 * they will be silently discarded.
 * @param {Number|String} termId
 * @return {String}
 */
function getTermDetailsInit(termId) {
  return _.toString(termId);
}

/**
 * Payload creator for TERMS/GET_TERM_DETAILS_DONE action,
 * which fetch details of the specified term.
 * @param {Number|String} termId
 * @param {String} tokenV3
 * @return {Promise}
 */
function getTermDetailsDone(termId, tokenV3) {
  const service = getService(tokenV3);
  return service.getTermDetails(termId).then(details => ({ termId, details }));
}

/**
 * Payload creator for TERMS/GET_DOCU_SIGN_URL_INIT
 * @param  {Number|String} templateId id of document template to sign
 * @return {String} string format of the id
 */
function getDocuSignUrlInit(templateId) {
  return _.toString(templateId);
}

/**
 * Payload creator for TERMS/GET_DOCU_SIGN_URL_DONE
 * which generate the url of DoduSign term
 * @param  {Number|String} templateId id of document template to sign
 * @param  {String} returnUrl  callback url after finishing singing
 * @param  {String} tokenV3    auth token
 * @return {Promise}           promise of request result
 */
function getDocuSignUrlDone(templateId, returnUrl, tokenV3) {
  const service = getService(tokenV3);
  return service.getDocuSignUrl(templateId, returnUrl)
    .then(resp => ({ templateId, docuSignUrl: resp.recipientViewUrl }));
}

/**
 * Payload creator for TERMS/AGREE_TERM_INIT
 * @param  {Number|String} termId id of term
 * @return {String}        string format of the id
 */
function agreeTermInit(termId) {
  return _.toString(termId);
}

/**
 * Payload creator for TERMS/AGREE_TERM_DONE
 * @param  {Number|String} termId id of term
 * @param  {String} tokenV3    auth token
 * @return {Promise}           promise of request result
 */
function agreeTermDone(termId, tokenV3) {
  const service = getService(tokenV3);
  return service.agreeTerm(termId).then(resp => ({ termId, success: resp.success }));
}

/**
 * Payload creator for TERMS/CHECK_STATUS_DONE
 * which will check if all terms of specified entity have been agreed,
 *
 * NOTE:
 * As in some reason backend does not saves immediately that DocuSign term has been agreed
 * In case not all terms were agreed we try again after some delay.
 * Maximum quantity attempts and delay between attempts are configured in
 * MAX_ATTEMPTS and TIME_OUT
 *
 * TODO:
 * Looks like the bug described above was caused by server caching responses
 * at least for getTermDetails which is used by getCommunityTerms.
 * To fix it I've added nocache random value param in the terms service
 * for getTermDetails and it looks like works so we get results immediately.
 * This still have to be tested for challenges as they use another endpoint
 * in method getChallengeTerms.
 * Also terms which use third part service DocuSign has to be also tested prior
 * to removing multiple checks.
 * In case their agreed status is updated immediately, this code
 * has to simplified and don't make several attempts, only one.
 *
 * @param {Object} entity       entity object
 * @param {String} entity.type  entity type ['challenge'||'community']
 * @param {String} entity.id    entity id
 * @param {Object} tokens       object with tokenV2 and tokenV3 properties
 *
 * @return {Promise}           promise of request result
 */
function checkStatusDone(entity, tokens) {
  // timeout between checking status attempts
  const TIME_OUT = 5000;

  // maximum attempts to check status
  const MAX_ATTEMPTS = 5;

  // we set this flag for getTermsDone when MOCK_TERMS_SERVICE is true
  // so that checkStatusDone resolves to all terms agreed when mocking
  const mockAgreed = config.MOCK_TERMS_SERVICE;

  /**
   * Promisified setTimeout
   * @param  {Number} timeout timeout in milliseconds
   * @return {Promise}         resolves after timeout
   */
  const delay = timeout => new Promise(((resolve) => {
    setTimeout(resolve, timeout);
  }));

  /**
   * Makes attempt to check status
   * @param  {Number} maxAttempts maximum number of attempts to perform
   * @return {Promise}            resolves to the list of term objects
   */
  const checkStatus = maxAttempts => getTermsDone(entity, tokens, mockAgreed).then((res) => {
    const allAgreed = _.every(res.terms, 'agreed');

    // if not all terms are agreed and we still have some attempts to try
    if (!allAgreed && maxAttempts > 1) {
      return delay(TIME_OUT).then(() => checkStatus(maxAttempts - 1));
    }

    return res.terms;
  });

  return checkStatus(MAX_ATTEMPTS);
}

/**
 * Payload creator for the action that opens the specified terms modal.
 * @param {String} modalInstanceUuid ID of the terms modal instance to be
 *  opened. Any other instances of terms modals present in the page will be
 *  closed automatically by this action, as it is not safe to open multiple
 *  modals, (and makes no sense in current implementation).
 * @param {???} selectedTerm Optional. Selected term. It was not documented by
 *  author of related code, thus the exact value is not clear.
 * @return {Object} Action payload.
 */
function openTermsModal(modalInstanceUuid, selectedTerm) {
  return { modalInstanceUuid, selectedTerm };
}

/**
 * Payload creator for the action that closes the specified terms modal.
 * @param {String} modalInstanceUuid ID of the terms modal instance to be
 *  closed. If another terms modal is open, it won't be affected.
 * @return {String} Action payload.
 */
function closeTermsModal(modalInstanceUuid) {
  return modalInstanceUuid;
}

export default createActions({
  TERMS: {
    GET_TERMS_INIT: _.identity,
    GET_TERMS_DONE: getTermsDone,
    GET_TERM_DETAILS_INIT: getTermDetailsInit,
    GET_TERM_DETAILS_DONE: getTermDetailsDone,
    GET_DOCU_SIGN_URL_INIT: getDocuSignUrlInit,
    GET_DOCU_SIGN_URL_DONE: getDocuSignUrlDone,
    AGREE_TERM_INIT: agreeTermInit,
    AGREE_TERM_DONE: agreeTermDone,

    OPEN_TERMS_MODAL: openTermsModal,
    CLOSE_TERMS_MODAL: closeTermsModal,

    SELECT_TERM: _.identity,
    SIGN_DOCU: _.identity,
    CHECK_STATUS_INIT: _.noop,
    CHECK_STATUS_DONE: checkStatusDone,
  },
});
