/* global
  fetch, Promise
*/

import _ from 'lodash';

// filter out empty challenge buckets, and if currentFilter is passed in,
// find the bucket with the filter name and only leave that bucket in
export function filterFilterChallengesStore(filterChallengesStore, currentFilter) {
  const allFilters = [
    (store) => {
      if (currentFilter && !currentFilter.allIncluded) {
        return _.pick(store, [currentFilter.name]);
      }

      return store;
    },
    _.partialRight(_.pickBy, challenges => !_.isEmpty(challenges)),
  ];

  return _.flow(allFilters)(_.assign({}, filterChallengesStore));
}

export function findFilterByName(filterName, filters) {
  const foundfilter = _.find(
    filters,
    filter => filter.name.toLowerCase() === filterName.toLowerCase(),
  );

  if (foundfilter) {
    return _.assign({}, foundfilter);
  }
  return {};
}

// format a challenge gotten from the API endpoint
// this is necessary for the challenge to be filtered and sorted in
// other components
function formatChallenge(challenge) {
  const formattedChallenge = _.assign({}, challenge);

  formattedChallenge.communities = new Set([formattedChallenge.challengeCommunity]);
  formattedChallenge.track = challenge.challengeCommunity.toUpperCase();
  formattedChallenge.subTrack = challenge.challengeType.toUpperCase().split(' ').join('_');

  return formattedChallenge;
}

export function fetchChallenges(getUrl, pageIndex) {
  return fetch(getUrl(pageIndex))
    .then(response => response.json())
    .then(responseJson => responseJson.data.map(formatChallenge));
}

// check if the category can be expanded beyond initial number to show more challenges
export function isChallengeCategoryExpandable({
  initialNumberToShow,
  filteredChallengeNumber,
  unFilteredChallengeNumber,
  challengeCountTotal,
}) {
  return (
    filteredChallengeNumber > initialNumberToShow
    || (
      challengeCountTotal
      && challengeCountTotal > unFilteredChallengeNumber
    )
  );
}
