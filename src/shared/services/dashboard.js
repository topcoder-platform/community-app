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
   * @param {Number} page page number
   * @param {Number} perPage total challenges per page
   * @returns
   */
  getChallenges(page = 1, perPage = 10) {
    return this.private.api.get(`/challenges/?page=${page}&perPage=${perPage}&types[]=CH&types[]=F2F&types[]=TSK&tracks[]=DES&tracks[]=DEV&tracks[]=DS&tracks[]=QA&status=Active&sortBy=updated&sortOrder=desc&isLightweight=true&tPhaseName=Registration`)
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
