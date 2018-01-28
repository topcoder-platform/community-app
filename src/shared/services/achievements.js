/**
 * This service provides user achievements data via TC API V2
 */
import { getApiV2 } from './api';

class AchivementService {
  constructor() {
    this.private = {
      api: getApiV2(),
    };
  }

  /**
   * get achievements for the handler specified, call to the end point used by this service
   * doesn't need auth
   * @param  {String} handle user id
   * @return {Promise}       promise of the request result
   */
  getUserAchievements(handle) {
    return this.private.api.get(`/users/${handle}`)
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
        return new Error(resp.statusText);
      });
  }
}

/**
 * Returns a new or existing achievement service.
 * @return {AchivementService} Achievement service object
 */
let lastInstance = null;
export function getService() {
  if (!lastInstance) {
    lastInstance = new AchivementService();
  }
  return lastInstance;
}

/* Using default export would be confusing in this case. */
export default undefined;
