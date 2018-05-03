/**
 * Sidebar content in the regular mode: Renders a list of challenge buckets,
 * and custom user-saved filters, allowing to switch between them. It also
 * has a link switching the sidebar into filters editor mode.
 */

import PT from 'prop-types';
import React from 'react';
import { BUCKETS } from 'utils/challenge-listing/buckets';
import { filter as Filter } from 'topcoder-react-lib';

import Bucket from './Bucket';

import './style.scss';

const RSS_LINK = 'http://feeds.topcoder.com/challenges/feed?list=active&contestType=all';

export default function BucketSelector({
  activeBucket,
  activeSavedFilter,
  buckets,
  challenges,
  communityFilter,
  disabled,
  extraBucket,
  filterState,
  isAuth,
  savedFilters,
  selectBucket,
  selectSavedFilter,
  setEditSavedFiltersMode,
}) {
  let filteredChallenges = challenges.filter(Filter.getFilterFunction(filterState));

  if (communityFilter) {
    filteredChallenges = filteredChallenges.filter(Filter.getFilterFunction(communityFilter));
  }

  const getBucket = bucket => (
    <Bucket
      active={!disabled && activeBucket === bucket}
      bucket={buckets[bucket]}
      challenges={filteredChallenges}
      disabled={disabled}
      onClick={() => {
        selectBucket(bucket);
        /* eslint-env browser */
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }}
    />
  );

  const savedFiltersRender = savedFilters.map((item, index) => (
    <Bucket
      active={
        (activeBucket === BUCKETS.SAVED_FILTER
          || activeBucket === BUCKETS.SAVED_REVIEW_OPPORTUNITIES_FILTER)
          && index === activeSavedFilter
      }
      bucket={{
        hideCount: true,
        name: item.filter.isForReviewOpportunities ?
          `${item.name} (Review Opportunities)` : item.name,
        error: item.filterError,
      }}
      challenges={[]}
      key={item.id}
      onClick={() => selectSavedFilter(index)}
    />
  ));

  return (
    <div>
      {getBucket(BUCKETS.ALL)}
      {isAuth ? getBucket(BUCKETS.MY) : null}
      {extraBucket ? getBucket(extraBucket) : null}
      {getBucket(BUCKETS.OPEN_FOR_REGISTRATION)}
      {getBucket(BUCKETS.ONGOING)}
      <hr />
      {getBucket(BUCKETS.REVIEW_OPPORTUNITIES)}
      {getBucket(BUCKETS.PAST)}
      {/* NOTE: We do not show upcoming challenges for now, for various reasons,
        * more political than technical ;)
          getBucket(BUCKETS.UPCOMING) */
      }
      {
        savedFilters.length ?
          <div>
            <div styleName="my-filters">
              <h1>My filters</h1>
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
          </div> : ''
      }
      <hr />
      <div styleName="get-rss">
        <a href={RSS_LINK}>Get the RSS feed</a>
      </div>
    </div>
  );
}

BucketSelector.defaultProps = {
  communityFilter: null,
  disabled: false,
  extraBucket: null,
  isAuth: false,
};

BucketSelector.propTypes = {
  activeBucket: PT.string.isRequired,
  activeSavedFilter: PT.number.isRequired,
  buckets: PT.shape().isRequired,
  challenges: PT.arrayOf(PT.shape({
    registrationOpen: PT.string.isRequired,
  })).isRequired,
  communityFilter: PT.shape(),
  disabled: PT.bool,
  extraBucket: PT.string,
  filterState: PT.shape().isRequired,
  isAuth: PT.bool,
  savedFilters: PT.arrayOf(PT.shape()).isRequired,
  selectBucket: PT.func.isRequired,
  selectSavedFilter: PT.func.isRequired,
  setEditSavedFiltersMode: PT.func.isRequired,
};
