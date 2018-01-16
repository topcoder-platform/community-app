/**
 * XML <-> JSON coversion service.
 */

/* global fetch */
import 'isomorphic-fetch';
import config from 'utils/config';
import { isServerSide } from './isomorphy';

const xml2json = isServerSide() ? require('xml2json') : null;

/**
 * Makes XML -> JSON conversion.
 * @param {String} xml XML document to convert.
 * @return {Promise} Resolves to JSON document.
 */
export function toJson(xml) {
  if (xml2json) return Promise.resolve(xml2json.toJson(xml, { object: true }));
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
