/**
* Utility functions for Review Opportunities
*/
// import _ from 'lodash';
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

  // return [
  //   {
  //     role: 'Primary Reviewer',
  //     roleId: 1,
  //     payment: 250,
  //     termsOfUseId: '20704',
  //     openPositions: 1,
  //   },
  //   {
  //     role: 'Secondary Reviewer',
  //     roleId: 2,
  //     payment: 125,
  //     termsOfUseId: '20704',
  //     openPositions: 2,
  //   },
  // ];
};

export default null;
