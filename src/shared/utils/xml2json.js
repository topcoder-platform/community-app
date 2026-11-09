/**
 * XML <-> JSON coversion service.
 */


import 'isomorphic-fetch';
import { config, isomorphy } from 'topcoder-react-utils';

const xml2json = isomorphy.isServerSide() ? require('./xml-parser.cjs') : null;

/**
 * Makes XML -> JSON conversion.
 * @param {String} xml XML document to convert.
 * @return {Promise} Resolves to JSON document.
 */
export async function toJson(xml) {
  if (xml2json) {
    return xml2json(xml);
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
