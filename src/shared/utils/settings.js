/**
 * Provides misc settings page helper functions.
 */
import _ from 'lodash';

export function isEmpty(value) {
  return value == null || value === '' || _.isEqual(value, []) || _.isEqual(value, {});
}

export function validateStartDate(flag, fromDate, toDate) {
  const result = {
    invalid: false,
    message: '',
  };

  const currentDate = new Date().setHours(0, 0, 0, 0);

  if (!isEmpty(fromDate)) {
    const startDate = new Date(fromDate).setHours(0, 0, 0, 0);

    if (startDate > currentDate) {
      result.invalid = true;
      result.message = 'Start Date should be in past or current';
    }
  }

  if (!isEmpty(toDate)) {
    const endDate = new Date(toDate).setHours(0, 0, 0, 0);
    if (flag) {
      if (!isEmpty(fromDate)) {
        const startDate = new Date(fromDate).setHours(0, 0, 0, 0);
        if (startDate >= endDate) {
          result.invalid = true;
          result.message = 'Start Date should be before End Date';
        }
      }
    } else if (!flag && !isEmpty(fromDate)) {
      const startDate = new Date(fromDate).setHours(0, 0, 0, 0);
      if (startDate >= endDate) {
        result.invalid = true;
        result.message = 'Start Date should be before End Date';
      }
    }
  }

  return result;
}

export function validateEndDate(flag, fromDate, toDate) {
  const result = {
    invalid: false,
    message: '',
  };

  const currentDate = new Date().setHours(0, 0, 0, 0);

  if (!isEmpty(toDate)) {
    const endDate = new Date(toDate).setHours(0, 0, 0, 0);
    if (flag) {
      if (!isEmpty(fromDate)) {
        if (endDate > currentDate) {
          result.invalid = true;
          result.message = 'End Date should be current or in past';
        }
      } else if (isEmpty(fromDate)) {
        if (endDate > currentDate) {
          result.invalid = true;
          result.message = 'End Date should be current or in past';
        }
      }
    }
  }

  return result;
}

export default {
  validateStartDate,
  validateEndDate,
};
