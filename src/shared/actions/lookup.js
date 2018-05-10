/**
 * Lookup api actions.
 */
import { createActions } from 'redux-actions';

import { getService } from 'services/lookup';

/**
 * Gets approved skill tags.
 * @return {Promise} Resolves to the approved skills object.
 */
function getApprovedSkills() {
  const service = getService();
  const params = {
    domain: 'SKILLS',
    status: 'APPROVED',
  };
  return service.getTags(params);
}

export default createActions({
  LOOKUP: {
    GET_APPROVED_SKILLS: getApprovedSkills,
  },
});
