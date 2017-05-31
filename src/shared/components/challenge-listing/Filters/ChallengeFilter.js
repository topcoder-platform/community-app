/* global
  atob, btoa
*/

/**
 * This Filter class represents the filters managed by the ChallengeFilters
 * component. It inherits the filters managed by the FilterPanel.
 */

import _ from 'lodash';

import FilterPanelFilter from './FiltersPanel/FilterPanelFilter';

export const DATA_SCIENCE_TRACK = 'datasci';
export const DESIGN_TRACK = 'design';
export const DEVELOP_TRACK = 'develop';

/**
 * Returns true if two sets have at least a single equal element.
 * @param {Set} a
 * @param {Set} b
 * @return Boolean result.
 */
function doIntersect(a, b) {
  const it = a.values();
  let d = it.next();
  while (!d.done) {
    if (b.has(d.value)) return true;
    d = it.next();
  }
  return false;
}

class ChallengeFilter extends FilterPanelFilter {

  constructor(arg) {
    if (!arg) {
      super();
      this.tracks = new Set([DATA_SCIENCE_TRACK, DESIGN_TRACK, DEVELOP_TRACK]);
    } else if (arg.isSavedFilter) {
      // If this is a saved filter then the track information is
      // present on the 'type' attribute

      super(arg);
      const filters = arg.filter.split('&');
      const tracks = filters.filter(e => e.startsWith('tracks'))
        .map(element => element.split('=')[1]);
      this.tracks = new Set(tracks);
    } else if (_.isObject(arg)) {
      if (!arg.isChallengeFilter) throw new Error('Invalid argument!');
      super(arg);
      this.tracks = new Set(arg.tracks);
    } else if (_.isString(arg)) {
      const f = JSON.parse(atob(arg));
      super(f[0]);
      this.tracks = new Set(f[1] ? f[1].split(',') : undefined);
    } else throw new Error('Invalid argument!');
    this.isChallengeFilter = true;
  }

  count() {
    return 1 + super.count();
  }

  getFilterFunction() {
    const parent = super.getFilterFunction();
    return (item) => {
      if (this.tracks.size && item.communities && !doIntersect(this.tracks, item.communities)) {
        return false;
      }
      return parent(item);
    };
  }

  merge(filter) {
    super.merge(filter);
    if (!filter.isChallengeFilter) return this;
    this.tracks = new Set(filter.tracks);
    return this;
  }

  stringify() {
    return btoa(JSON.stringify([
      super.stringify(),
      [...this.tracks].join(','),
    ]));
  }

  getTracks() {
    return Array.from(this.tracks).join('&');
  }

/**
 * Get an URL Encoded string representation of the filter tracks.
 * Used for saving to the backend and displaying on the URL for deep linking.
 */
  getURLEncoded() {
    const str = this.tracks.size > 0 ?
      Array.from(this.tracks).reduce((acc, track) => `${acc}&tracks=${encodeURIComponent(track)}`, '') : '';
    return `${super.getURLEncoded()}${str}`;
  }
}

export default ChallengeFilter;
