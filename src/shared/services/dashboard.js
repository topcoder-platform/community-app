import qs from 'qs';
import { services } from 'topcoder-react-lib';

const { getApi } = services.api;

class DashboardService {
  /**
   * @param {String} tokenV6 Optional. Auth token for Topcoder API v6.
   */
  constructor(tokenV6) {
    this.private = {
      api: getApi('V6', tokenV6),
      tokenV6,
    };
  }

  /**
   *
   * @param {Object} query the request query
   * @returns
   */
  getChallenges(query) {
    return this.private.api.get(`/challenges/?${qs.stringify(query)}`)
      .then(res => (res.ok ? res.json() : new Error(res.statusText)));
  }
}

/**
 * Returns a new or existing challenges service.
 * @param {String} tokenV6 Optional. Auth token for Topcoder API v6.
 * @return {DashboardService} Dashboard service object
 */
let lastInstance = null;
export function getService(tokenV6) {
  if (!lastInstance || tokenV6 !== lastInstance.private.tokenV6) {
    lastInstance = new DashboardService(tokenV6);
  }
  return lastInstance;
}

/* Using default export would be confusing in this case. */
export default undefined;
