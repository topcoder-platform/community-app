/**
 * The bucket for review opportunities.
 */
import React from 'react';
import _ from 'lodash';
import PT from 'prop-types';
import Waypoint from 'react-waypoint';
import SortingSelectBar from 'components/SortingSelectBar';
import { BUCKET_DATA } from 'utils/challenge-listing/buckets';
import Sort from 'utils/challenge-listing/sort';
import { getReviewOpportunitiesFilterFunction } from 'utils/reviewOpportunities';

import ReviewOpportunityCard from '../../ReviewOpportunityCard';
import CardPlaceholder from '../../placeholders/ChallengeCard';

import './style.scss';

const NO_RESULTS_MESSAGE = 'No challenges found';
const LOADING_MESSAGE = 'Loading Challenges';

// Functional implementation of ReviewOpportunityBucket component
export default function ReviewOpportunityBucket({
  bucket,
  challengesUrl,
  expandedTags,
  expandTag,
  filterState,
  keepPlaceholders,
  needLoad,
  loading,
  loadMore,
  opportunities,
  setFilterState,
  setSort,
  challengeTypes,
  sort,
  setSearchText,
}) {
  if (!opportunities.length && !loadMore) return null;

  const activeSort = sort || BUCKET_DATA[bucket].sorts[0];

  const sortedOpportunities = _.clone(opportunities);
  sortedOpportunities.sort(Sort[activeSort].func);

  /* Filtering for Review Opportunities will be done entirely in the front-end
   * which means it can be done at render, rather than in the reducer,
   * which avoids reloading the review opportunities from server every time
   * a filter is changed.  */
  const filteredOpportunities = sortedOpportunities.filter(
    getReviewOpportunitiesFilterFunction({
      ...BUCKET_DATA[bucket].filter, // Default bucket filters from utils/buckets.js
      ...filterState, // User selected filters
    }, challengeTypes),
    // }),
  );

  const cards = filteredOpportunities.map(item => (
    <ReviewOpportunityCard
      challengesUrl={challengesUrl}
      challengeType={_.find(challengeTypes, { name: item.challengeData.track }) || {}}
      expandedTags={expandedTags}
      expandTag={expandTag}
      onTechTagClicked={(tag) => {
        setFilterState({ search: tag });
        setSearchText(tag);
      }}
      opportunity={item}
      key={item.id}
    />
  ));

  const placeholders = [];
  if ((loading || keepPlaceholders) && cards.length === 0) {
    for (let i = 0; i < 10; i += 1) {
      placeholders.push(<CardPlaceholder id={i} key={i} />);
    }
  }

  return (
    <div styleName="review-opportunity-bucket">
      {
        filteredOpportunities
          ? filteredOpportunities.length > 0 && (
            <SortingSelectBar
              title="Open for review"
              options={
                BUCKET_DATA[bucket].sorts.map(item => ({
                  label: Sort[item].name,
                  value: item,
                }))
              }
              value={{
                label: Sort[activeSort].name,
                value: activeSort,
              }}
              onSelect={setSort}
            />
          )
          : (
            <SortingSelectBar
              title="Open for review"
              onSelect={setSort}
              options={
                BUCKET_DATA[bucket].sorts.map(item => ({
                  label: Sort[item].name,
                  value: item,
                }))
              }
              value={{
                label: Sort[activeSort].name,
                value: activeSort,
              }}
            />
          )
      }
      {cards}
      {
        !loading && filteredOpportunities.length === 0 && (
          <div>
            <div styleName="review-opportunity-bucket">
              <SortingSelectBar
                title={BUCKET_DATA[bucket].name}
                options={
                  BUCKET_DATA[bucket].sorts.map(item => ({
                    label: Sort[item].name,
                    value: item,
                  }))
                }
                value={{
                  label: Sort[activeSort].name,
                  value: activeSort,
                }}
                onSelect={setSort}
              />
              <h1 styleName="no-results">
                {needLoad ? LOADING_MESSAGE : NO_RESULTS_MESSAGE}
              </h1>
            </div>
          </div>
        )
      }
      {
        loadMore && !loading ? (
          <Waypoint onEnter={loadMore} />
        ) : null
      }
      {placeholders}
    </div>
  );
}

// Default Props
ReviewOpportunityBucket.defaultProps = {
  expandedTags: [],
  expandTag: null,
  keepPlaceholders: false,
  needLoad: false,
  loading: false,
  loadMore: null,
  sort: null,
};

// Prop Validation
ReviewOpportunityBucket.propTypes = {
  // bucket: PT.shape().isRequired,
  bucket: PT.string.isRequired,
  challengesUrl: PT.string.isRequired,
  expandedTags: PT.arrayOf(PT.number),
  expandTag: PT.func,
  filterState: PT.shape().isRequired,
  opportunities: PT.arrayOf(PT.shape()).isRequired,
  keepPlaceholders: PT.bool,
  needLoad: PT.bool,
  loading: PT.bool,
  loadMore: PT.func,
  setFilterState: PT.func.isRequired,
  setSort: PT.func.isRequired,
  sort: PT.string,
  challengeTypes: PT.arrayOf(PT.shape()).isRequired,
  setSearchText: PT.func.isRequired,
};
