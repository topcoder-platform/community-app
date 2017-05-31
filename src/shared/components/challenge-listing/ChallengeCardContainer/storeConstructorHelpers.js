/* global
  fetch, Promise
*/

import _ from 'lodash';
import challengeFilters from './challengeFilters';

// construct a store with filter/bucket name as key and its current
// matched challenges as value
export function getFilterChallengesStore(filters, challenges) {
  const nonAllInclusiveFilters = _.filter(filters, filter => (!filter.allIncluded));
  const filterChallengesStore = nonAllInclusiveFilters.reduce(
    (filterStore, filter) => _.set(filterStore, filter.name, []),
    {},
  );

  return challenges.reduce((filterStore, challenge) => (
    nonAllInclusiveFilters.reduce((store, filter) => {
      if (filter.check(challenge)) store[filter.name].push(challenge);
      return store;
    }, filterStore)
  ), filterChallengesStore);
}

// construct a store with filter/bucket name as key and its stored
// sorting setting name as value
export function getFilterSortingStore(filters, sortingSetting = {}) {
  return filters.reduce((filterSortingStore, filter) => (
    _.set(
      filterSortingStore,
      filter.name,
      sortingSetting[filter.name] || filter.sortingOptions[0],
    )
  ), {});
}

// construct a store with filter/bucket name as key and its total challenge
// count as value if available
export function getFilterTotalCountStore() {
  return Promise.all(
    challengeFilters.map((filter) => {
      const newFilter = _.assign({}, filter);

      if (filter.getApiUrl) {
        return fetch(filter.getApiUrl(1, 1))
          .then(response => response.json())
          .then((responseJson) => {
            if (responseJson.result) {
              return _.set(newFilter, 'totalCount', responseJson.result.metadata.totalCount);
            }
            return _.set(newFilter, 'totalCount', responseJson.total);
          });
      }
      return _.set(newFilter, 'totalCount', null);
    }),
  ).then(filters => (
    filters.reduce((filterTotalCountStore, filter) => (
      _.set(filterTotalCountStore, filter.name, filter.totalCount)
    ), {})
  ));
}
