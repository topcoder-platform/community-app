/** Community IDs with dedicated route implementations in this application. */
const COMMUNITY_IDS = [
  'blockchain',
  'community-2',
  'cognitive',
  'cs',
  'demo-expert',
  'iot',
  'mobile',
  'qa',
  'srmx',
  'taskforce',
  'tc-prod-dev',
  'veterans',
  'wipro',
];

/** Matches the supported annual TCO community IDs from tco01 through tco23. */
const TCO_COMMUNITY_ID = /^tco(?:0[1-9]|1[0-9]|2[0-3])$/;

/**
 * Tests whether Community App has a dedicated route implementation for an ID.
 *
 * @param {String} communityId Community identifier resolved from a route or subdomain.
 * @return {Boolean} True when the identifier has a supported route implementation.
 */
export default function isSupportedCommunityId(communityId) {
  return COMMUNITY_IDS.includes(communityId) || TCO_COMMUNITY_ID.test(communityId);
}
