/* eslint-disable no-plusplus */
import _ from 'lodash';
import { isomorphy } from 'topcoder-react-utils';
import { removeTrailingSlash } from 'utils/url';

/**
 * Normalizes styles object to ReactJS format (camelCase property names).
 * @param {Object} style
 * @return {Object}
 */
export function fixStyle(style) {
  return style ? _.mapKeys(style, (value, key) => _.camelCase(key)) : undefined;
}

// Concatenates a base and segment and handles optional trailing slashes
const buildUrl = (base, segment) => `${_.trimEnd(base, '/')}/${_.trim(segment, '/')}`;

/**
 * Checks if URL is absolute
 * @param {String} url
 */
function isAbsolute(url) {
  return url.startsWith('http:') || url.startsWith('https:');
}

/**
 * Builds target url for menu link
 * @param {String} baseUrl
 * @param {String} item
 */
export function target(baseUrl, item) {
  // use/prefer url if available
  let to = '';
  if (item.fields.url) {
    // for Routes or NavigationMenuItem entries with a non-empty url field
    to = isAbsolute(item.fields.url) ? item.fields.url : buildUrl(baseUrl, item.fields.url);
  } else if (item.fields.slug) {
    // for NavigationMenuItem entries without an URL field
    // menu item slug to build the url
    to = buildUrl(baseUrl, item.fields.slug);
  } else {
    // for Routes with no url
    to = baseUrl;
  }
  return to;
}

/**
 * Checks if menu link is active
 * @param {String} baseUrl
 * @param {String} item
 */
export function isActive(baseUrl, item, caller) {
  let to = removeTrailingSlash(target(baseUrl, item));
  to = to ? to.toLowerCase() : to;

  let location;
  if (isomorphy.isClientSide()) {
    location = isAbsolute(to) ? buildUrl(window.location.origin, window.location.pathname)
      : window.location.pathname;
    location = location.toLowerCase();
  } else {
    // TODO: should probably get the current URL from the web framework
    return false;
  }

  // handles the special case when url === `/`
  if (caller === 'menuItem'
  && to === baseUrl
  && (location !== to && location !== `${to}/`)) {
    return false;
  }

  // check if the current location is the link target or a subdirectory
  return location && (location === to || location.startsWith(`${to}/`));
}

/**
 * Picks the text for menu links
 * @param {Object} item
 */
export function linkText(item) {
  return item.fields.naviMenuLinkText /* Route-only */
    || item.fields.linkText /* NavigationMenuItem-only */ || item.fields.name;
}

/**
 * Builds navi menu items
 * @param {String} baseUrl
 * @param {Object} item
 */
export function menuItemBuilder(baseUrl, item) {
  switch (item.sys.contentType.sys.id) {
    case 'route':
      return {
        title: item.fields.naviMenuLinkText || item.fields.name,
        href: target(baseUrl, item),
      };
    case 'navigationMenuItem':
      return {
        title: item.fields.linkText || item.fields.name,
        href: target(baseUrl, item),
      };
    default: return {};
  }
}

/**
 * Normalizes the EDU taxonomy object as fetched from Contentful
 * @param {Object} EDUTaxonomy The EDU taxonomy
 * @param {Object} query The current url query
 */
export function tracksTreeBuilder(EDUTaxonomy, query) {
  const tax = _.isArray(query.tax) ? query.tax : [query.tax];
  let id = 0;
  return _.map(EDUTaxonomy, (categories, track) => ({
    title: track,
    id: id++,
    items: _.map(categories, cat => ({
      title: cat.name, id: id++, items: [], track, selected: _.indexOf(tax, cat.name) !== -1,
    })),
    selected: query.track === track,
  }));
}

export default undefined;
