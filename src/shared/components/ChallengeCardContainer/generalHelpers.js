/* global
  fetch, Promise
*/

import _ from 'lodash';

const COMMUNITIES = {
  DEVELOP: 'develop',
  DESIGN: 'design',
  DATA_SCIENCE: 'datasci',
};

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

// TODO: Remove this commented code?

// format a challenge gotten from the API endpoint
// this is necessary for the challenge to be filtered and sorted in
// other components
// No need to call this function as data is in correct format with V3 api.
// function formatChallenge(challenge) {
//   const formattedChallenge = _.assign({}, challenge);

//   formattedChallenge.communities = new Set([formattedChallenge.challengeCommunity]);
//   formattedChallenge.track = challenge.challengeCommunity.toUpperCase();
//   formattedChallenge.subTrack = challenge.challengeType.toUpperCase().split(' ').join('_');

//  return formattedChallenge;
// }

function addCommunity(challenge) {
  const updatedChallenge = _.assign({}, challenge);
  updatedChallenge.communities = new Set([COMMUNITIES[challenge.track]]);
  return updatedChallenge;
}

export function fetchChallenges(getUrl, pageIndex) {
  return fetch(getUrl(pageIndex))
    .then(response => response.json())
    .then(responseJson => responseJson.result.content.map(addCommunity));
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
