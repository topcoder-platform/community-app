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

function getDocuSignUrlInit(templateId) {
  return _.toString(templateId);
}

function getDocuSignUrlDone(templateId, returnUrl, tokenV2) {
  const service = getService(tokenV2);
  return service.getDocuSignUrl(templateId, returnUrl)
    .then(resp => ({ templateId, docuSignUrl: resp.recipientViewUrl }));
}

function agreeTermInit(termId) {
  return _.toString(termId);
}

function agreeTermDone(termId, tokenV2) {
  const service = getService(tokenV2);
  return service.agreeTerm(termId).then(resp => ({ termId, success: resp.success }));
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
  },
});
