import _ from 'lodash';

const PROFILE_PLACEHOLDER = /<%=\s*profile\.(firstName|lastName|handle|userId)\s*%>/g;

/**
 * Interpolates the profile placeholders supported by Contentful markdown.
 *
 * MarkdownRenderer uses this helper before parsing markdown so personalized
 * content remains compatible with a strict Content Security Policy. Only the
 * documented firstName, lastName, handle, and userId properties are replaced;
 * other template-like text remains literal and is never evaluated as code.
 * Profile values are HTML-escaped before being added to the markdown.
 *
 * @param {String} markdown Markdown content that may contain profile placeholders.
 * @param {Object} profile Authenticated member profile used for replacements.
 * @return {String} Markdown with supported placeholders safely replaced. Missing
 *   profile values are replaced with an empty string.
 * @throws {TypeError} If markdown is not a string.
 * @example
 * interpolateProfilePlaceholders('Hello <%= profile.handle %>', { handle: 'tourist' });
 */
export default function interpolateProfilePlaceholders(markdown = '', profile = {}) {
  return markdown.replace(PROFILE_PLACEHOLDER, (placeholder, property) => {
    const value = profile && Object.prototype.hasOwnProperty.call(profile, property)
      ? profile[property]
      : '';

    return _.escape(value == null ? '' : String(value));
  });
}
