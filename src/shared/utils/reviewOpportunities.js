/**
* Utility functions for Review Opportunities
*/

/**
 * Infers open positions using review opportunity details and organizes them by role
 *
 * @param {Object} details Review Opportuny details from API
 * @return {Array} List of roles with corresponding data
 */
export const openPositionsByRole = (details) => {
  if (!details.applications) return [];

  const roleCount = details.payments.length;

  let approved;
  if (details.openPositions === 1 && roleCount === 2) {
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
    termsOfUseId: details.challenge.terms.find(terms => terms.role === role).termsOfUseId,
    openPositions: calcOpenPositions(role),
  }));
};

export default null;
