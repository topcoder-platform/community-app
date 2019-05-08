/**
 * A single bucket of challenges.
 */

/* global document */

import _ from 'lodash';
import PT from 'prop-types';
import qs from 'qs';
import React from 'react';
import SortingSelectBar from 'components/SortingSelectBar';
import Waypoint from 'react-waypoint';
import { challenge as challengeUtil } from 'topcoder-react-lib';
import CardPlaceholder from '../../placeholders/ChallengeCard';
import ChallengeCard from '../../ChallengeCard';
import './style.scss';

const COLLAPSED_SIZE = 10;

const { SORTS_DATA } = challengeUtil.sort;

export default function Bucket({
  bucket,
  bucketId,
  challenges,
  challengesUrl,
  expanded,
  expand,
  filterState,
  keepPlaceholders,
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
  userHandle,
  expandedTags,
  expandTag,
  loadMoreChallenges,
}) {
  const activeSort = sort || bucket.sorts[0];

  const bucketQuery = qs.stringify({
    bucket: bucketId,
    communityId: selectedCommunityId || undefined,
    filter: filterState,
  }, { encodeValuesOnly: true });

  let expandable = false;
  const challengeList = [];
  for (let i = 0; i < challenges.length; i += 1) {
    challengeList.push(challenges[i]);
    if (!expanded && challengeList.length >= COLLAPSED_SIZE) {
      expandable = true;
      break;
    }
  }


  const placeholders = [];
  if ((loading || keepPlaceholders) && (!expandable || expanded)) {
    for (let i = 0; i < 8; i += 1) {
      placeholders.push(<CardPlaceholder id={i} key={i} />);
    }
  }

  if (!challengeList.length && !loadMore) {
    if (loading) {
      return (
        <div styleName="bucket">
          {placeholders}
        </div>
      );
    }
    return null;
  }

  const cards = challengeList.map(item => (
    <ChallengeCard
      challenge={item}
      challengesUrl={challengesUrl}
      newChallengeDetails={newChallengeDetails}
      onTechTagClicked={tag => setFilterState({ tags: [tag] })}
      openChallengesInNewTabs={openChallengesInNewTabs}
      prizeMode={prizeMode}
      key={item.id}
      selectChallengeDetailsTab={selectChallengeDetailsTab}
      userHandle={userHandle}
      expandedTags={expandedTags}
      expandTag={expandTag}
    />
  ));

  return (
    <div styleName="bucket">
      <SortingSelectBar
        onSelect={setSort}
        options={
          bucket.sorts.map(item => ({
            label: SORTS_DATA[item].name,
            value: item,
          }))
        }
        title={bucket.name}
        value={{
          label: SORTS_DATA[activeSort].name,
          value: activeSort,
        }}
      />
      {cards}
      {placeholders}
      {
        !expandable && loadMore && !loading ? (
          <Waypoint onEnter={loadMore} />
        ) : null
      }
      {
        (expandable || loadMore) && (expandable || !keepPlaceholders) && !loading && !expanded ? (
          <a
            href={`${challengesUrl}?${bucketQuery}`}
            onClick={(event) => {
              expand();
              document.body.scrollTop = 0;
              document.documentElement.scrollTop = 0;
              loadMoreChallenges(bucketId);
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
  );
}

Bucket.defaultProps = {
  expanded: false,
  expand: _.noop,
  keepPlaceholders: false,
  loading: false,
  loadMore: null,
  newChallengeDetails: false,
  openChallengesInNewTabs: false,
  sort: null,
  userHandle: '',
  expandedTags: [],
  expandTag: null,
  loadMoreChallenges: null,
};

Bucket.propTypes = {
  bucket: PT.shape().isRequired,
  bucketId: PT.string.isRequired,
  expanded: PT.bool,
  expand: PT.func,
  challenges: PT.arrayOf(PT.shape()).isRequired,
  challengesUrl: PT.string.isRequired,
  filterState: PT.shape().isRequired,
  keepPlaceholders: PT.bool,
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
  userHandle: PT.string,
  expandedTags: PT.arrayOf(PT.number),
  expandTag: PT.func,
  loadMoreChallenges: PT.func,
};
