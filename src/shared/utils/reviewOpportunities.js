/**
* Utility functions for Review Opportunities
*/
import _ from 'lodash';

/**
 * Infers open positions using review opportunity details and organizes them by role
 *
 * @param {Object} details Review Opportuny details from API
 * @return {Array} List of roles with corresponding data
 */
export const openPositionsByRole = (details) => {
  if (!details.payments) return [];

  const roleCount = details.payments.length;

  let approved;
  if (details.applications && details.openPositions === 1 && roleCount === 2) {
    approved = details.applications.find(app => app.status === 'Approved').role;
  }

  const calcOpenPositions = (role) => {
    if (approved) {
      return role === approved ? 0 : 1;
    }
    return details.openPositions / roleCount;
  };

  return details.payments.map(({ role, roleId, payment }) => ({
    role,
    roleId,
    payment,
    termsOfUseId: '20704',
    openPositions: calcOpenPositions(role),
  }));
};

/**
 * Builds a list of roleIds of existing applications for user
 *
 * @param {Object} details Review Opportunity details from API
 * @param {String} handle Handle of the user
 * @return {Array} List of rolesIds
 */
export const activeRoleIds = (details, handle) => {
  const positions = openPositionsByRole(details);
  const apps = details.applications
    ? details.applications.filter(app => _.toString(app.handle) === _.toString(handle) && app.status !== 'CANCELLED') : [];
  return apps.map(app => positions.find(p => p.role === app.role).roleId);
};

export default null;
