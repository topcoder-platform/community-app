/**
 * This filter extends ChallengeFilter to add the filtering by a free-text
 * string, which components are searched in challenge names, platforms and
 * technologies.
 */

import _ from 'lodash';
import BaseFilter from './ChallengeFilter';

class Filter extends BaseFilter {

  constructor(filterString) {
    if (filterString) {
      const f = JSON.parse(filterString);
      super(f[0]);
      this.query = f[1];
    } else {
      super();
      this.query = '';
    }
  }

  clone() {
    const res = Filter();
    _.merge(res, _.cloneDeep(this));
    return res;
  }

  count() {
    let res = super.count();
    if (this.query) res += 1;
    return res;
  }

  getFilterFunction() {
    const parent = super.getFilterFunction();
    return (item) => {
      if (!parent(item)) return false;
      if (this.query) {
        const str = `${item.name} ${item.platforms} ${item.technologies}`.toLowerCase();
        if (str.indexOf(this.query.toLowerCase()) < 0) return false;
      }
      return true;
    };
  }

  stringify() {
    return JSON.stringify([
      super.stringify(),
      this.query,
    ]);
  }
}

export default Filter;
