/* global
  atob, btoa
*/

/**
 * This Filter class represents the filters managed by the FiltersPanel component.
 * Have a look at the base class for additional details.
 */

import _ from 'lodash';
import moment from 'moment';
import BaseFilter from '../BaseFilter';

class FilterPanelFilter extends BaseFilter {

  constructor(arg) {
    if (!arg) {
      super();
      this.groupId = null;
      this.endDate = null;
      this.keywords = [];
      this.startDate = null;
      this.subtracks = [];
    } else if (arg.isSavedFilter) {
      super(arg);
      const filters = arg.filter.split('&');

      this.groupId = filters.filter(e => e.startsWith('groupId'))
        .map(e => e.split('=')[1])[0] || null;

      this.startDate = filters.filter(e => e.startsWith('startDate'))
        .map(element => element.split('=')[1]);
      this.startDate = this.startDate[0] ? moment(this.startDate[0]) : null;
      this.endDate = filters.filter(e => e.startsWith('endDate'))
        .map(element => element.split('=')[1]);
      this.endDate = this.endDate[0] ? moment(this.endDate[0]) : null;

      this.keywords = filters.filter(e => e.startsWith('keywords'))
        .map(element => element.split('=')[1]);
      // We use "challengeTypes" to represent subtracks to maintain compatibility with old app
      this.subtracks = filters.filter(e => e.startsWith('challengeTypes'))
        .map(element => element.split('=')[1]);
    } else if (_.isObject(arg)) {
      if (!arg.isFilterPanelFilter) throw new Error('Invalid argument!');
      super(arg);
      this.groupId = arg.groupId || null;
      this.endDate = arg.endDate ? moment(arg.endDate) : null;
      this.keywords = _.cloneDeep(arg.keywords);
      this.startDate = arg.startDate ? moment(arg.startDate) : null;
      this.subtracks = _.cloneDeep(arg.subtracks);
    } else if (_.isString(arg)) {
      const f = JSON.parse(atob(arg));
      super(f[0]);
      this.endDate = f[1] === 'null' ? null : moment(f[1]);
      this.keywords = f[2].split(',');
      this.startDate = f[3] === 'null' ? null : moment(f[3]);
      this.subtracks = f[4].split(',');
      this.groupId = f[5] || null;
    } else throw new Error('Invalid argument!');
    this.isFilterPanelFilter = true;
  }

  count() {
    let res = super.count();
    if (this.keywords.length && this.keywords[0]) res += 1;
    if (this.subtracks.length && this.subtracks[0]) res += 1;
    if (this.endDate || this.startDate) res += 1;
    if (this.groupId) res += 1;
    return res;
  }

  getFilterFunction() {
    const parent = super.getFilterFunction();
    return (item) => {
      if (this.groupId && !item.groups[this.groupId]) return false;
      const filterSubtrack = this.subtracks.map(st =>
        st.toLowerCase().split(' ').join(''));
      const itemSubtrack = item.subTrack.toLowerCase().split('_').join('');
      if (!parent(item)) return false;
      if (this.subtracks.length && this.subtracks[0]
      && !filterSubtrack.includes(itemSubtrack)) return false;
      if (this.startDate && this.startDate.isAfter(item.submissionEndDate)) return false;
      if (this.endDate && this.endDate.isBefore(item.createdAt)) return false;
      if (!this.keywords.length || !this.keywords[0]) return true;
      const data = ` ${item.name} ${item.platforms} ${item.technologies} `.toLowerCase();
      for (let i = 0; i !== this.keywords.length; i += 1) {
        if (data.indexOf(` ${this.keywords[i].toLowerCase()} `) >= 0) return true;
      }
      return false;
    };
  }

  merge(filter) {
    super.merge(filter);
    if (!filter.isFilterPanelFilter) return this;
    this.groupId = filter.groupId;
    this.endDate = filter.endDate ? moment(filter.endDate) : null;
    this.keywords = _.cloneDeep(filter.keywords);
    this.startDate = filter.startDate ? moment(filter.startDate) : null;
    this.subtracks = _.cloneDeep(filter.subtracks);
    return this;
  }

  stringify() {
    return btoa(JSON.stringify([
      super.stringify(),
      this.endDate ? this.endDate.toString() : 'null',
      this.keywords.join(','),
      this.startDate ? this.startDate.toString() : 'null',
      this.subtracks.join(','),
      this.groupId,
    ]));
  }
  /**
   *  Get an URL Encoded string representation of the filter properties.
   *  Used for saving to the backend and displaying on the URL for deep linking.
   *  We use "challengeTypes" to represent subtracks to maintain compatibility with old app
   */
  getURLEncoded() {
    let result = '';
    result += this.startDate ? `&startDate=${this.startDate.format('YYYY-MM-DD')}` : '';
    result += this.endDate ? `&endDate=${this.endDate.format('YYYY-MM-DD')}` : '';
    result += this.keywords.length > 0 ?
      this.keywords.reduce((acc, keyword) => `${acc}&keywords=${keyword}`, '') : '';
    result += this.subtracks.length > 0 ?
      this.subtracks.reduce((acc, subtrack) => `${acc}&challengeTypes=${subtrack}`, '') : '';
    result += this.groupId ? `&groupId=${this.groupId}` : '';
    return result;
  }
}

export default FilterPanelFilter;
