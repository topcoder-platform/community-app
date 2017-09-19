/**
 * This module keeps the mapping between URL sub-domains and different segments
 * of the application.
 */

/* The mapping between URL subdomains and IDs of Topcoder Communities. 
 * To mount some community to a dedicated subdomain, add here the record in
 * "subdomain": "communityId" format. */
const SUBDOMAIN_COMMUNITY = {
  blockchain: 'blockchain',
  'community-2': 'community-2',
  'demo-expert': 'demo-expert',
  qa: 'qa',
  srmx: 'srmx',
  taksforce: 'taskforce',
  'tc-prod-dev': 'tc-prod-dev',
  topgear: 'wipro',
  veterans: 'veterans',
  wipro: 'wipro',
};

/**
 * Given an array of URL subdomains it returns TC community ID, if some
 * community is mounted on these subdomains, or an empty string otherwise.
 * @param {String Array} subdomains
 * @return {String}
 */
export function getCommunityId(subdomains) {
  if (!subdomains) return '';
  for (let i = 0; i < subdomains.length; i += 1) {
    const communityId = SUBDOMAIN_COMMUNITY[subdomains[i]];
    if (communityId) return communityId;
  }
  return '';
}

export default undefined;
