const { XMLParser, XMLValidator } = require('fast-xml-parser');

// Preserve the legacy xml2json shape used by RSS consumers, including empty
// elements as objects, string values, attributes and mixed text under `$t`.
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '$t',
  parseTagValue: false,
  ignoreDeclaration: true,
  ignorePiTags: true,
  maxNestedTags: 100,
  processEntities: {
    maxEntitySize: 10000,
    maxExpansionDepth: 10,
    maxTotalExpansions: 10000,
    maxExpandedLength: 100000,
    maxEntityCount: 100,
  },
});

function normalize(value) {
  if (value === '') return {};
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => (
      key.startsWith('@_') ? [key.slice(2), item] : [key, normalize(item)]
    )));
  }
  return value;
}

module.exports = function parseXml(xml) {
  // RSS needs predefined XML entities, but no external or custom DTD entities.
  if (typeof xml !== 'string' || xml.length > 1024 * 1024
      || /<!DOCTYPE/i.test(xml) || XMLValidator.validate(xml) !== true) {
    throw new Error('Invalid XML document');
  }
  return normalize(parser.parse(xml));
};
