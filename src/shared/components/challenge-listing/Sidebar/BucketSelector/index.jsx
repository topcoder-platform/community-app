/**
 * Sidebar content in the regular mode: Renders a list of challenge buckets,
 * and custom user-saved filters, allowing to switch between them. It also
 * has a link switching the sidebar into filters editor mode.
 */

import PT from 'prop-types';
import React from 'react';
import { BUCKETS } from 'utils/challenge-listing/buckets';
// import { challenge as challengeUtils } from 'topcoder-react-lib';

import Bucket from './Bucket';

import './style.scss';

// const Filter = challengeUtils.filter;

// DISABLED: Until feeds.topcoder.com domain fixed community-app#4606
// const RSS_LINK = 'http://feeds.topcoder.com/challenges/feed?list=active&contestType=all';

export default function BucketSelector({
  activeBucket,
  // activeSavedFilter,
  // buckets,
  // challenges,
  // communityFilter,
  disabled,
  expanding,
  // extraBucket,
  // filterState,
  isAuth,
  // savedFilters,
  selectBucket,
  // selectSavedFilter,
  // setEditSavedFiltersMode,
  past,
}) {
  // let filteredChallenges = challenges.filter(Filter.getFilterFunction(filterState));

  // if (communityFilter) {
  // filteredChallenges = filteredChallenges.filter(Filter.getFilterFunction(communityFilter));
  // }

  const getBucket = (bucket) => {
    const isActive = expanding
      ? bucket === BUCKETS.ALL || bucket === BUCKETS.ALL_PAST
      : activeBucket === bucket;
    return (
      <Bucket
        active={!disabled && isActive}
        bucket={bucket}
        // challenges={challenges}
        disabled={disabled}
        onClick={() => {
          selectBucket(bucket);
          /* eslint-env browser */
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }}
      />
    );
  };

  // const savedFiltersRender = savedFilters.map((item, index) => (
  //   <Bucket
  //     active={
  //       (activeBucket === BUCKETS.SAVED_FILTER
  //         || activeBucket === BUCKETS.SAVED_REVIEW_OPPORTUNITIES_FILTER)
  //         && index === activeSavedFilter
  //     }
  //     bucket={{
  //       hideCount: true,
  //       name: item.filter.isForReviewOpportunities
  //         ? `${item.name} (Review Opportunities)` : item.name,
  //       error: item.filterError,
  //     }}
  //     challenges={[]}
  //     key={item.id}
  //     onClick={() => selectSavedFilter(index)}
  //   />
  // ));

  return (!past
    ? (
      <div styleName="bucketSelector">
        {getBucket(BUCKETS.ALL)}
        {isAuth ? getBucket(BUCKETS.MY) : null}
        {/* {extraBucket ? getBucket(extraBucket) : null} */}
        {getBucket(BUCKETS.OPEN_FOR_REGISTRATION)}
        {/* DISABLED: Until api receive fix community-app#5073 */}
        {/* {getBucket(BUCKETS.ONGOING)} */}
        {getBucket(BUCKETS.REVIEW_OPPORTUNITIES)}
        {getBucket(BUCKETS.COPILOT_OPPORTUNITIES)}
        {/* {getBucket(BUCKETS.PAST)} */}
        {/* NOTE: We do not show upcoming challenges for now, for various reasons,
          * more political than technical ;)
            getBucket(BUCKETS.UPCOMING) */
        }
        {/* {
          savedFilters.length
            ? (
              <div>
                <div styleName="my-filters">
                  <h1>
                    My filters
                  </h1>
                  <a
                    onClick={() => setEditSavedFiltersMode(true)}
                    onKeyPress={() => setEditSavedFiltersMode(true)}
                    role="button"
                    styleName="edit-link"
                    tabIndex={0}
                  >
                    edit
                  </a>
                </div>
                {savedFiltersRender}
              </div>
            ) : ''
        } */}
        {/* DISABLED: Until feeds.topcoder.com domain fixed community-app#4606 */}
        {/*
        <div styleName="get-rss">
          <a href={RSS_LINK}>
            Get the RSS feed
          </a>
        </div>
        */}
      </div>
    ) : (
      <div styleName="bucketSelector">
        {getBucket(BUCKETS.ALL_PAST)}
        {isAuth ? getBucket(BUCKETS.MY_PAST) : null}
      </div>
    )
  );
}

BucketSelector.defaultProps = {
  // communityFilter: null,
  disabled: false,
  // extraBucket: null,
  isAuth: false,
  expanding: false,
  past: false,
};

BucketSelector.propTypes = {
  activeBucket: PT.string.isRequired,
  expanding: PT.bool,
  // activeSavedFilter: PT.number.isRequired,
  // buckets: PT.shape().isRequired,
  // challenges: PT.arrayOf(PT.shape({
  // })).isRequired,
  // communityFilter: PT.shape(),
  disabled: PT.bool,
  // extraBucket: PT.string,
  // filterState: PT.shape().isRequired,
  isAuth: PT.bool,
  // savedFilters: PT.arrayOf(PT.shape()).isRequired,
  selectBucket: PT.func.isRequired,
  // selectSavedFilter: PT.func.isRequired,
  // setEditSavedFiltersMode: PT.func.isRequired,
  past: PT.bool,
};
