/**
 * Terms specific actions.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import { getService } from 'services/terms';

/**
 * Payload creator for TERMS/GET_TERMS_INIT action,
 * which marks that we are about to fetch terms of the specified challenge.
 * If any challenge terms for another challenge are currently being fetched,
 * they will be silently discarded.
 * @param {Number|String} challengeId
 * @return {String}
 */
function getTermsInit(challengeId) {
  return _.toString(challengeId);
}

/**
 * Payload creator for TERMS/GET_TERMS_DONE action,
 * which fetch terms of the specified challenge.
 * @param {Number|String} challengeId
 * @param {String} tokenV2
 * @return {Promise}
 */
function getTermsDone(challengeId, tokenV2) {
  const service = getService(tokenV2);
  return service.getTerms(challengeId).then(res => ({ challengeId, terms: res.terms }));
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
 * @param {String} tokenV2
 * @return {Promise}
 */
function getTermDetailsDone(termId, tokenV2) {
  const service = getService(tokenV2);
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
 * @param  {String} tokenV2    auth token
 * @return {Promise}           promise of request result
 */
function getDocuSignUrlDone(templateId, returnUrl, tokenV2) {
  const service = getService(tokenV2);
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
 * @param  {String} tokenV2    auth token
 * @return {Promise}           promise of request result
 */
function agreeTermDone(termId, tokenV2) {
  const service = getService(tokenV2);
  return service.agreeTerm(termId).then(resp => ({ termId, success: resp.success }));
}

/**
 * Payload creator for TERMS/CHECK_STATUS_DONE
 * which will check if all terms of specified challenge have been agreed,
 *
 * NOTE:
 * As in some reason backend does not saves immediately that DocuSign term has been agreed
 * In case not all terms were agreed we try again after some delay.
 * Maximum quantity attempts and delay between attempts are configured in
 * MAX_ATTEMPTS and TIME_OUT
 *
 * @param  {Number|String} challengeId id of challenge to check
 * @param  {String} tokenV2    auth token
 *
 * @return {Promise}           promise of request result
 */
function checkStatusDone(challengeId, tokenV2) {
  // timeout between checking status attempts
  const TIME_OUT = 5000;

  // maximum attempts to check status
  const MAX_ATTEMPTS = 5;

  const service = getService(tokenV2);

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
  const checkStatus = maxAttempts => service.getTerms(challengeId).then((res) => {
    const allAgreed = _.every(res.terms, 'agreed');

    // if not all terms are agreed and we still have some attempts to try
    if (!allAgreed && maxAttempts > 1) {
      return delay(TIME_OUT).then(() => checkStatus(maxAttempts - 1));
    }

    return res.terms;
  });

  return checkStatus(MAX_ATTEMPTS);
}

export default createActions({
  TERMS: {
    GET_TERMS_INIT: getTermsInit,
    GET_TERMS_DONE: getTermsDone,
    GET_TERM_DETAILS_INIT: getTermDetailsInit,
    GET_TERM_DETAILS_DONE: getTermDetailsDone,
    GET_DOCU_SIGN_URL_INIT: getDocuSignUrlInit,
    GET_DOCU_SIGN_URL_DONE: getDocuSignUrlDone,
    AGREE_TERM_INIT: agreeTermInit,
    AGREE_TERM_DONE: agreeTermDone,
    OPEN_TERMS_MODAL: _.identity,
    CLOSE_TERMS_MODAL: _.noop,
    SELECT_TERM: _.identity,
    SIGN_DOCU: _.identity,
    CHECK_STATUS_INIT: _.noop,
    CHECK_STATUS_DONE: checkStatusDone,
  },
});
