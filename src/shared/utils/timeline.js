import _ from 'lodash';
import { config } from 'topcoder-react-utils';

/**
 * Check If logged user is admin.
 *
 * @params {Object} auth
 */
export const checkIsAdmin = (auth) => {
  const userRoles = config.TIMELINE_ADMIN_ROLES;
  const { user } = auth;
  const { roles } = user;

  return _.intersection(userRoles || [], roles || []).length > 0;
};

/**
 * Get event rejection reasons.
 */
export const getRejectioneReasons = () => [
  { field: 'Duplicate Event', value: 'duplicate' },
  { field: 'Not Relevant', value: 'relevant' },
  { field: 'Too Old', value: 'old' },
];

/**
 * Get event rejection reasons.
 *
 *  @params {Number} index
 */
export const getAccentColor = (index) => {
  const colors = ['#8231A9', '#219174', '#BE405E'];

  return colors[index % 3];
};

export default undefined;
