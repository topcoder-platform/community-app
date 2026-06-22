import { config } from 'topcoder-react-utils';

const NDA_TITLE_PATTERN = /\bnda\b|non[-\s]?disclosure/i;

/**
 * Checks whether a terms record represents an NDA-style agreement.
 *
 * @param {Object|null} term terms-service record or details payload.
 * @returns {Boolean} true when the term title is NDA/non-disclosure related.
 */
export function isNdaTerm(term = {}) {
  return NDA_TITLE_PATTERN.test((term && term.title) || '');
}

/**
 * Resolves the DocuSign template id to use for a terms-service record.
 *
 * @param {Object|null} term terms-service record or details payload.
 * @returns {String|Number|undefined} configured NDA template id for NDA terms,
 * or the template id returned by terms-service for all other terms.
 */
export function getDocuSignTemplateIdForTerm(term = {}) {
  const configuredNdaTemplateId = config.NDA_DOCUSIGN_TEMPLATE_ID;
  if (configuredNdaTemplateId && isNdaTerm(term)) {
    return configuredNdaTemplateId;
  }

  return term ? term.docusignTemplateId : undefined;
}
