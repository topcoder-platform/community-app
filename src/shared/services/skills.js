import qs from 'qs';
import { services } from 'topcoder-react-lib';

const { getApi } = services.api;

class SkillService {
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
  getSkills(term) {
    return this.private.api.get(`/emsi-skills/skills/auto-complete?${qs.stringify({
      term,
    })}`)
      .then(res => (res.ok ? res.json() : new Error(res.statusText)));
  }
}

/**
 * Returns a new or existing challenges service.
 * @param {String} tokenV5 Optional. Auth token for Topcoder API v5.
 * @return {SkillService} Skill service object
 */
export function getService(tokenV5) {
  return new SkillService(tokenV5);
}

/* Using default export would be confusing in this case. */
export default undefined;
