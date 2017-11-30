/**
 * The bucket for review opportunities.
 */
import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import Sort from 'utils/challenge-listing/sort';
import SortingSelectBar from 'components/SortingSelectBar';
import Waypoint from 'react-waypoint';
import CardPlaceholder from '../../placeholders/ChallengeCard';
import ReviewOpportunityCard from '../../ReviewOpportunityCard';

import './style.scss';

// Functional implementation of ReviewOpportunityBucket component
export default function ReviewOpportunityBucket({
  bucket,
  challengesUrl,
  expandedTags,
  expandTag,
  keepPlaceholders,
  loading,
  loadMore,
  opportunities,
  sort,
  setSort,
}) {
  if (!opportunities.length && !loadMore) return null;

  const activeSort = sort || bucket.sorts[0];

  const sortedOpportunities = _.clone(opportunities);
  sortedOpportunities.sort(Sort[activeSort].func);

  const cards = sortedOpportunities.map(item => (
    <ReviewOpportunityCard
      challengesUrl={challengesUrl}
      expandedTags={expandedTags}
      expandTag={expandTag}
      opportunity={item}
      key={item.id}
    />
  ));

  const placeholders = [];
  if (loading || keepPlaceholders) {
    for (let i = 0; i < 8; i += 1) {
      placeholders.push(<CardPlaceholder id={i} key={i} />);
    }
  }

  return (
    <div styleName="review-opportunity-bucket">
      <SortingSelectBar
        title="Open for review"
        onSelect={setSort}
        options={
          bucket.sorts.map(item => ({
            label: Sort[item].name,
            value: item,
          }))
        }
        value={{
          label: Sort[activeSort].name,
          value: activeSort,
        }}
      />
      {cards}
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
  loading: false,
  loadMore: null,
  sort: null,
};

// Prop Validation
ReviewOpportunityBucket.propTypes = {
  bucket: PT.shape().isRequired,
  challengesUrl: PT.string.isRequired,
  expandedTags: PT.arrayOf(PT.number),
  expandTag: PT.func,
  opportunities: PT.arrayOf(PT.shape()).isRequired,
  keepPlaceholders: PT.bool,
  loading: PT.bool,
  loadMore: PT.func,
  setSort: PT.func.isRequired,
  sort: PT.string,
};
