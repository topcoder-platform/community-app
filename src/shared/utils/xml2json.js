/**
 * XML <-> JSON coversion service.
 */

/* global fetch */
import 'isomorphic-fetch';
import { config, isomorphy } from 'topcoder-react-utils';

const XMLParser = isomorphy.isServerSide()
  ? require('fast-xml-parser').XMLParser
  : null;

/**
 * Matches the former xml2json package's representation of empty elements.
 *
 * @param {*} value parsed XML value.
 * @return {*} value with empty elements represented as objects.
 */
function normalizeEmptyElements(value) {
  if (value === '') return {};
  if (Array.isArray(value)) return value.map(normalizeEmptyElements);
  if (value && typeof value === 'object') {
    return Object.keys(value).reduce((result, key) => ({
      ...result,
      [key]: normalizeEmptyElements(value[key]),
    }), {});
  }
  return value;
}

/**
 * Makes XML -> JSON conversion.
 * @param {String} xml XML document to convert.
 * @return {Promise} Resolves to JSON document.
 */
export function toJson(xml) {
  if (XMLParser) {
    const parser = new XMLParser({
      attributeNamePrefix: '',
      ignoreAttributes: false,
    });
    return Promise.resolve(normalizeEmptyElements(parser.parse(xml)));
  }
  return fetch('/community-app-assets/api/xml2json', {
    body: JSON.stringify({ xml }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `ApiKey ${config.SERVER_API_KEY}`,
    },
    method: 'POST',
  }).then(res => res.json());
}

export default undefined;
