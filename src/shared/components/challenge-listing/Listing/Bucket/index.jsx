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
import {
  NO_LIVE_CHALLENGES_CONFIG, BUCKETS, BUCKET_DATA, isRecommendedChallengeType,
} from 'utils/challenge-listing/buckets';
import SortingSelectBar from 'components/SortingSelectBar';
import Waypoint from 'react-waypoint';
// import { challenge as challengeUtils } from 'topcoder-react-lib';
import CardPlaceholder from '../../placeholders/ChallengeCard';
import ChallengeCard from '../../ChallengeCard';
import NoRecommenderChallengeCard from '../../NoRecommenderChallengeCard';
import './style.scss';

// const COLLAPSED_SIZE = 10;

// const Filter = challengeUtils.filter;
const LOADING_MESSAGE = 'Loading Challenges';

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
  needLoad,
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
  setSearchText,
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

  let filteredChallenges = sortedChallenges;
  filteredChallenges = sortedChallenges.filter((ch) => {
    if (ch.type === 'Task'
      && ch.task
      && ch.task.isTask
      && ch.task.isAssigned
      && Number(ch.task.memberId) !== Number(userId)) {
      return null;
    }
    return ch;
  });

  // sortedChallenges.sort(Sort[activeSort].func);

  // const bucketQuery = qs.stringify({
  //   bucket: bucketId,
  //   communityId: selectedCommunityId || undefined,
  //   filter: filterState,
  // }, { encodeValuesOnly: true });

  const expandable = true;
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

  if (!loading && filteredChallenges.length === 0) {
    return (
      <div>
        <div styleName="bucket">
          <SortingSelectBar
            title={BUCKET_DATA[bucket].name}
          />
          <h1 styleName="no-results">
            {
              needLoad ? LOADING_MESSAGE
                : (
                  `${NO_LIVE_CHALLENGES_CONFIG[activeBucket]}`
                )
            }
          </h1>
        </div>
      </div>
    );
  }
  const cards = filteredChallenges.map(challenge => (
    <ChallengeCard
      challenge={challenge}
      challengeType={_.find(challengeTypes, { name: challenge.type })}
      challengesUrl={challengesUrl}
      newChallengeDetails={newChallengeDetails}
      onTechTagClicked={(tag, isSkill) => {
        setFilterState({
          ..._.clone(filterState),
          ...isSkill ? {
            searchSkills: [tag],
          } : {
            search: tag,
          },
          types: challengeTypes.map(type => type.abbreviation),
        });
        setSearchText(tag);
      }}
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

  const isRecommended = isRecommendedChallengeType(bucket, filterState);
  const sectionTile = 'OPEN FOR REGISTRATION';
  const isHighestPaying = isRecommended && _.sumBy(filteredChallenges, 'jaccard_index') === 0;
  return (
    // challenges.length !== 0
    // && (
    <div>
      <div styleName="bucket">
        {
          isRecommended
            ? filteredChallenges.length > 0 && (
            <SortingSelectBar
              title={sectionTile}
            />
            )
            : (
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
            )
        }
        {
          isHighestPaying && (!loading || filteredChallenges.length > 0)
          && <NoRecommenderChallengeCard />
        }
        {cards}
        {
          !expanding && !expandable && loadMore && !loading && activeBucket === bucket ? (
            <Waypoint onEnter={loadMore} />
          ) : null
        }
        {placeholders}
        {
          // eslint-disable-next-line max-len
          // (expandable || loadMore) && (expandable || !keepPlaceholders) && !loading && !expanded ? (
          // eslint-disable-next-line max-len
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
    </div>
    // )
  );
}

Bucket.defaultProps = {
  expanded: false,
  expand: _.noop,
  challengeTypes: [],
  // keepPlaceholders: false,
  needLoad: false,
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
  needLoad: PT.bool,
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
  userId: PT.number,
  expandedTags: PT.arrayOf(PT.number),
  expandTag: PT.func,
  activeBucket: PT.string,
  // searchTimestamp: PT.number,
  isLoggedIn: PT.bool.isRequired,
  setSearchText: PT.func.isRequired,
};
