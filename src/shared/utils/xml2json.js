/**
 * XML <-> JSON coversion service.
 */

/* global fetch */
import 'isomorphic-fetch';

import { isServerSide } from './isomorphy';

const xml2json = isServerSide() ? require('xml2json') : null;

/**
 * Makes XML -> JSON conversion.
 * @param {String} xml XML document to convert.
 * @return {Promise} Resolves to JSON document.
 */
export function toJson(xml) {
  if (xml2json) return Promise.resolve(xml2json.toJson(xml, { object: true }));
  return fetch('/api/xml2json', {
    body: JSON.stringify({ xml }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  }).then(res => res.json());
}

export default undefined;
