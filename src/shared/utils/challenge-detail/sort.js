/**
 * Collection of compare function to sort some list item of challenge detail.
 */
import _ from 'lodash';

/**
 * Sort list
 * @param {Array} list list need to be sorted
 */
function sortList(list, field, sort, getValue) {
  const compare = (a, b) => {
    if (a > b) {
      return 1;
    }

    if (a === b) {
      return 0;
    }

    return -1;
  };

  list.sort((a, b) => {
    let valueForAB = {};
    valueForAB = getValue(a, b);
    let { valueA, valueB } = valueForAB;
    const { valueIsString } = valueForAB;
    if (valueIsString) {
      if (_.isNil(valueA)) {
        valueA = '';
      }
      if (_.isNil(valueB)) {
        valueB = '';
      }
    } else {
      if (_.isNil(valueA)) {
        valueA = 0;
      }
      if (_.isNil(valueB)) {
        valueB = 0;
      }
    }
    if (sort === 'desc') {
      return compare(valueB, valueA);
    }

    return compare(valueA, valueB);
  });
}

export default sortList;
