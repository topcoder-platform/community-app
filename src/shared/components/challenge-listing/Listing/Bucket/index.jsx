/**
 * A single bucket of challenges.
 */

/* global document */

import _ from 'lodash';
import PT from 'prop-types';
// import qs from 'qs';
import React, { useRef } from 'react';
// import { config } from 'topcoder-react-utils';
import Sort from 'utils/challenge-listing/sort';
import { NO_LIVE_CHALLENGES_CONFIG, BUCKETS, BUCKET_DATA } from 'utils/challenge-listing/buckets';
import SortingSelectBar from 'components/SortingSelectBar';
import Waypoint from 'react-waypoint';
// import { challenge as challengeUtils } from 'topcoder-react-lib';
import CardPlaceholder from '../../placeholders/ChallengeCard';
import ChallengeCard from '../../ChallengeCard';
import './style.scss';

// const COLLAPSED_SIZE = 10;

// const Filter = challengeUtils.filter;

export default function Bucket({
  bucket,
  // bucketId,
  challenges,
  challengeTypes,
  challengesUrl,
  expanded,
  expanding,
  expand,
  filterState,
  // keepPlaceholders,
  loading,
  loadMore,
  newChallengeDetails,
  openChallengesInNewTabs,
  prizeMode,
  selectChallengeDetailsTab,
  // selectedCommunityId,
  setFilterState,
  setSort,
  sort,
  userId,
  expandedTags,
  expandTag,
  activeBucket,
  // searchTimestamp,
  isLoggedIn,
}) {
  const refs = useRef([]);
  refs.current = [];
  const addToRefs = (el) => {
    if (el) {
      refs.current.push(el);
    }
  };
  const activeSort = sort || 'startDate';

  // const sortedChallenges = activeBucket === 'all' ?
  //   _.clone(challenges.slice(0, 10)) : _.clone(challenges);
  let sortedChallenges;
  if ((activeBucket === BUCKETS.ALL || activeBucket === BUCKETS.ALL_PAST) && !expanded) {
    if (loadMore && challenges.length > 10) {
      sortedChallenges = _.clone(challenges);
    } else {
      sortedChallenges = _.clone(challenges.slice(0, 10));
    }
  } else {
    sortedChallenges = _.clone(challenges);
  }
  // sortedChallenges.sort(Sort[activeSort].func);

  // const bucketQuery = qs.stringify({
  //   bucket: bucketId,
  //   communityId: selectedCommunityId || undefined,
  //   filter: filterState,
  // }, { encodeValuesOnly: true });

  const expandable = activeBucket === BUCKETS.ALL || activeBucket === BUCKETS.ALL_PAST;
  // const filteredChallenges = [];
  // for (let i = 0; i < sortedChallenges.length; i += 1) {
  // if (filter(sortedChallenges[i])) {
  // filteredChallenges.push(sortedChallenges[i]);
  // }
  // if (!expanded && filteredChallenges.length >= COLLAPSED_SIZE) {
  // expandable = true;
  // break;
  // }
  // }

  // let noPastResult = false;
  // check if no past challenge is found after configurable amount of time has passed
  // if (activeBucket === BUCKETS.PAST && searchTimestamp > 0) {
  // && !filteredChallenges.length && !refs.current.length)
  // const elapsedTime = Date.now() - searchTimestamp;
  // noPastResult = elapsedTime > config.SEARCH_TIMEOUT;
  // }

  // if (noPastResult
  // // || (!filteredChallenges.length && !loadMore)) {
  // ) {
  //   if (activeBucket === BUCKETS.ALL) {
  //     return null;
  //   }
  //   return (
  //     <div styleName="no-results">
  //       {/* {`${NO_LIVE_CHALLENGES_CONFIG[bucketId]}`} */}
  //     </div>
  //   );
  // }

  if (!loading && sortedChallenges.length === 0) {
    return (
      <div styleName="no-results">
        { `${NO_LIVE_CHALLENGES_CONFIG[bucket]}` }
      </div>
    );
  }
  const cards = sortedChallenges.map(challenge => (
    <ChallengeCard
      challenge={challenge}
      challengeType={_.find(challengeTypes, { name: challenge.type })}
      challengesUrl={challengesUrl}
      newChallengeDetails={newChallengeDetails}
      onTechTagClicked={tag => setFilterState({ ..._.clone(filterState), tags: [tag], types: [] })}
      openChallengesInNewTabs={openChallengesInNewTabs}
      prizeMode={prizeMode}
      key={challenge.id}
      selectChallengeDetailsTab={selectChallengeDetailsTab}
      userId={userId}
      expandedTags={expandedTags}
      expandTag={expandTag}
      domRef={addToRefs}
      isLoggedIn={isLoggedIn}
    />
  ));

  const placeholders = [];
  if (loading) {
  // if ((loading || keepPlaceholders) && (!expandable || expanded)) {
    for (let i = 0; i < 10; i += 1) {
      placeholders.push(<CardPlaceholder id={i} key={i} />);
    }
  }

  // if (filteredChallenges.length && filteredChallenges.length < COLLAPSED_SIZE
  //   && placeholders.length
  //   && (!expandable && loadMore && !loading)) {
  //   // loaded challenge list has less than configured collapsed
  //   // invoke loadMore here
  //   // instead of waiting for scrolling to hit the react-waypoint to do the loadMore
  //   loadMore();
  // }

  return (
    // challenges.length !== 0
    // && (
    <div styleName="bucket">
      <SortingSelectBar
        onSelect={setSort}
        options={
          BUCKET_DATA[bucket].sorts.map(item => ({
            label: Sort[item].name,
            value: item,
          }))
        }
        title={BUCKET_DATA[bucket].name}
        value={{
          label: Sort[activeSort].name,
          value: activeSort,
        }}
      />
      {cards}
      {
        !expanding && !expandable && loadMore && !loading && activeBucket === bucket ? (
          <Waypoint onEnter={loadMore} />
        ) : null
      }
      {placeholders}
      {
      // (expandable || loadMore) && (expandable || !keepPlaceholders) && !loading && !expanded ? (
        (expanding || expandable) && !loading && loadMore && (expandable ? expanded : !expanded) ? (
          <a
            // href={`${challengesUrl}?${bucketQuery}`}
            href={`${challengesUrl}`}
            onClick={(event) => {
              expand();
              // document.body.scrollTop = 0;
              // document.documentElement.scrollTop = 0;
              event.preventDefault();
            }}
            role="button"
            styleName="view-more"
            tabIndex={0}
          >
            View more challenges
          </a>
        ) : null
      }
    </div>
    // )
  );
}

Bucket.defaultProps = {
  expanded: false,
  expand: _.noop,
  challengeTypes: [],
  // keepPlaceholders: false,
  loading: false,
  loadMore: null,
  newChallengeDetails: false,
  openChallengesInNewTabs: false,
  sort: null,
  userId: '',
  expandedTags: [],
  expandTag: null,
  activeBucket: '',
  expanding: false,
  // searchTimestamp: 0,
};

Bucket.propTypes = {
  bucket: PT.string.isRequired,
  // bucketId: PT.string.isRequired,
  expanded: PT.bool,
  expanding: PT.bool,
  expand: PT.func,
  challenges: PT.arrayOf(PT.shape()).isRequired,
  challengeTypes: PT.arrayOf(PT.shape()),
  challengesUrl: PT.string.isRequired,
  filterState: PT.shape().isRequired,
  // keepPlaceholders: PT.bool,
  loading: PT.bool,
  loadMore: PT.func,
  newChallengeDetails: PT.bool,
  openChallengesInNewTabs: PT.bool,
  prizeMode: PT.string.isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
  // selectedCommunityId: PT.string.isRequired,
  setFilterState: PT.func.isRequired,
  setSort: PT.func.isRequired,
  sort: PT.string,
  userId: PT.string,
  expandedTags: PT.arrayOf(PT.number),
  expandTag: PT.func,
  activeBucket: PT.string,
  // searchTimestamp: PT.number,
  isLoggedIn: PT.bool.isRequired,
};
