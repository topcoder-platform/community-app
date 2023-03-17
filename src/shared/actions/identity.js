import { createActions } from 'redux-actions';
import { getService } from '../services/identity';

/**
 * @static
 * @desc Creates an action that signals beginning of updating users primary role.
 * @return {Action}
 */
function updatePrimaryRoleInit() {}

/**
 * @static
 * @desc Update users primary role
 * @param {String} role - role to be updated can be 'Topcoder Talent' or 'Topcoder Customer'
 * @return {Action}
 */
async function updatePrimaryRoleDone(role, tokenV3) {
  return getService(tokenV3).updatePrimaryRole(role);
}


export default createActions({
  IDENTITY: {
    UPDATE_PRIMARY_ROLE_INIT: updatePrimaryRoleInit,
    UPDATE_PRIMARY_ROLE_DONE: updatePrimaryRoleDone,
  },
});
