/**
 * A single bucket of challenges.
 */

/* global document */

import _ from 'lodash';
import PT from 'prop-types';
import qs from 'qs';
import React from 'react';
import Sort from 'utils/challenge-listing/sort';
import SortingSelectBar from 'components/SortingSelectBar';
import Waypoint from 'react-waypoint';
import { getFilterFunction } from 'utils/challenge-listing/filter';
import CardPlaceholder from '../../placeholders/ChallengeCard';
import ChallengeCard from '../../ChallengeCard';
import './style.scss';

const COLLAPSED_SIZE = 10;

export default function Bucket({
  bucket,
  bucketId,
  challenges,
  challengesUrl,
  communityName,
  expanded,
  expand,
  filterState,
  loading,
  loadMore,
  newChallengeDetails,
  openChallengesInNewTabs,
  prizeMode,
  selectChallengeDetailsTab,
  selectedCommunityId,
  setFilterState,
  setSort,
  sort,
}) {
  const filter = getFilterFunction(bucket.filter);
  const activeSort = sort || bucket.sorts[0];

  const sortedChallenges = _.clone(challenges);
  sortedChallenges.sort(Sort[activeSort].func);

  const bucketQuery = qs.stringify({
    bucket: bucketId,
    communityId: selectedCommunityId || undefined,
    filter: filterState,
  }, { encodeValuesOnly: true });

  let expandable = false;
  const filteredChallenges = [];
  for (let i = 0; i < sortedChallenges.length; i += 1) {
    if (filter(sortedChallenges[i])) {
      filteredChallenges.push(sortedChallenges[i]);
    }
    if (!expanded && filteredChallenges.length >= COLLAPSED_SIZE) {
      expandable = true;
      break;
    }
  }

  if (!filteredChallenges.length && !loadMore) return null;

  const cards = filteredChallenges.map(item => (
    <ChallengeCard
      challenge={item}
      challengesUrl={challengesUrl}
      newChallengeDetails={newChallengeDetails || !communityName}
      onTechTagClicked={tag => setFilterState({ tags: [tag] })}
      openChallengesInNewTabs={openChallengesInNewTabs}
      prizeMode={prizeMode}
      key={item.id}
      selectChallengeDetailsTab={selectChallengeDetailsTab}
    />
  ));

  const placeholders = [];
  if (loading) {
    for (let i = 0; i < 8; i += 1) {
      placeholders.push(<CardPlaceholder id={i} key={i} />);
    }
  }

  return (
    <div styleName="bucket">
      <SortingSelectBar
        onSelect={setSort}
        options={
          bucket.sorts.map(item => ({
            label: Sort[item].name,
            value: item,
          }))
        }
        title={bucket.name}
        value={{
          label: Sort[activeSort].name,
          value: activeSort,
        }}
      />
      {cards}
      {placeholders}
      {
        (expandable || loadMore) && !loading && !expanded ? (
          <a
            href={`${challengesUrl}?${bucketQuery}`}
            onClick={(event) => {
              expand();
              document.body.scrollTop = 0;
              document.documentElement.scrollTop = 0;
              event.preventDefault();
            }}
            role="button"
            styleName="view-more"
            tabIndex={0}
          >View more challenges</a>
        ) : null
      }
      {
        !expandable && loadMore && !loading ? (
          <Waypoint onEnter={loadMore} />
        ) : null
      }
    </div>
  );
}

Bucket.defaultProps = {
  communityName: null,
  expanded: false,
  expand: _.noop,
  loading: false,
  loadMore: null,
  newChallengeDetails: false,
  openChallengesInNewTabs: false,
  sort: null,
};

Bucket.propTypes = {
  bucket: PT.shape().isRequired,
  bucketId: PT.string.isRequired,
  expanded: PT.bool,
  expand: PT.func,
  challenges: PT.arrayOf(PT.shape()).isRequired,
  challengesUrl: PT.string.isRequired,
  communityName: PT.string,
  filterState: PT.shape().isRequired,
  loading: PT.bool,
  loadMore: PT.func,
  newChallengeDetails: PT.bool,
  openChallengesInNewTabs: PT.bool,
  prizeMode: PT.string.isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
  selectedCommunityId: PT.string.isRequired,
  setFilterState: PT.func.isRequired,
  setSort: PT.func.isRequired,
  sort: PT.string,
};
