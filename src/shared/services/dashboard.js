import qs from 'qs';
import { services } from 'topcoder-react-lib';

const { getApi } = services.api;

class DashboardService {
  /**
   * @param {String} tokenV5 Optional. Auth token for Topcoder API v5.
   */
  constructor(tokenV5) {
    this.private = {
      api: getApi('V5', tokenV5),
      tokenV5,
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
 * @param {String} tokenV5 Optional. Auth token for Topcoder API v5.
 * @return {DashboardService} Dashboard service object
 */
let lastInstance = null;
export function getService(tokenV5) {
  if (!lastInstance || tokenV5 !== lastInstance.private.tokenV5) {
    lastInstance = new DashboardService(tokenV5);
  }
  return lastInstance;
}

/* Using default export would be confusing in this case. */
export default undefined;
