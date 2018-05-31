/**
 * Isomorphic Communities service.
 */
import { isomorphy } from 'topcoder-react-utils';
import { services } from 'topcoder-react-lib';

const preGetService = services.communities.getService;

/**
 * Returns a new or existing communities service.
 * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
 * @return {Communities} Communties service object
 */
let lastInstance = null;
export function getService(tokenV3) {
  if (!lastInstance || (tokenV3 !== lastInstance.private.tokenV3)) {
    if (isomorphy.isClientSide()) lastInstance = preGetService(tokenV3);
    else {
      /* eslint-disable global-require */
      const Service = require('server/services/communities').default;
      /* eslint-enable global-require */
      lastInstance = new Service(tokenV3);
    }
  }
  return lastInstance;
}

// Override with the isomorphic version
services.communities.getService = getService;

export default undefined;
