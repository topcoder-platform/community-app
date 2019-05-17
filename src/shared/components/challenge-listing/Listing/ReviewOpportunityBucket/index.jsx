/**
 * The bucket for review opportunities.
 */
import PT from 'prop-types';
import React from 'react';
import SortingSelectBar from 'components/SortingSelectBar';
import Waypoint from 'react-waypoint';
import { challenge as challengeUtil } from 'topcoder-react-lib';
import CardPlaceholder from '../../placeholders/ChallengeCard';
import ReviewOpportunityCard from '../../ReviewOpportunityCard';

import './style.scss';

const { SORTS_DATA } = challengeUtil.sort;

const NO_RESULTS_MESSAGE = 'There are no review opportunities available';

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
  setFilterState,
  setSort,
  sort,
}) {
  const activeSort = sort || bucket.sorts[0];


  const cards = opportunities.map(item => (
    <ReviewOpportunityCard
      challengesUrl={challengesUrl}
      expandedTags={expandedTags}
      expandTag={expandTag}
      onTechTagClicked={tag => setFilterState({ tags: [tag] })}
      opportunity={item}
      key={item.id}
    />
  ));

  const placeholders = [];
  if ((loading || keepPlaceholders) && cards.length === 0) {
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
            label: SORTS_DATA[item].name,
            value: item,
          }))
        }
        value={{
          label: SORTS_DATA[activeSort].name,
          value: activeSort,
        }}
      />
      {cards}
      {
        !loading && opportunities.length === 0 && (
          <div styleName="no-results">
            {NO_RESULTS_MESSAGE}
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
  setFilterState: PT.func.isRequired,
  setSort: PT.func.isRequired,
  sort: PT.string,
};
