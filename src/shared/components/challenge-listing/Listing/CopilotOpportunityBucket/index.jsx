import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import Sort from 'utils/challenge-listing/sort';
import { BUCKET_DATA } from 'utils/challenge-listing/buckets';
import SortingSelectBar from 'components/SortingSelectBar';
import Waypoint from 'react-waypoint';

import CopilotOpportunityHeader from 'components/challenge-listing/CopilotOpportunityHeader';
import CardPlaceholder from '../../placeholders/ChallengeCard';
import CopilotOpportunityCard from '../../CopilotOpportunityCard';

import './style.scss';


const NO_RESULTS_MESSAGE = 'No copilot opportunities found';
const LOADING_MESSAGE = 'Loading Copilot Opportunities';

export default function CopilotOpportunityBucket({
  bucket,
  challengesUrl,
  expandedTags,
  expandTag,
  keepPlaceholders,
  needLoad,
  loading,
  loadMore,
  opportunities,
  setFilterState,
  setSort,
  sort,
  setSearchText,
}) {
  if (!opportunities.length && !loadMore) return null;

  const activeSort = sort || BUCKET_DATA[bucket].sorts[0];

  const sortedOpportunities = _.clone(opportunities);
  sortedOpportunities.sort(Sort[activeSort].func);

  const filteredOpportunities = sortedOpportunities;

  const cards = filteredOpportunities.map(item => (
    <CopilotOpportunityCard
      challengesUrl={challengesUrl}
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
    <div styleName="copilot-opportunity-bucket">
      {filteredOpportunities.length > 0 && (
        <SortingSelectBar
          title="Copilot Opportunities"
          options={BUCKET_DATA[bucket].sorts.map(item => ({
            label: Sort[item].name,
            value: item,
          }))}
          value={{
            label: Sort[activeSort].name,
            value: activeSort,
          }}
          onSelect={setSort}
        />
      )}
      <CopilotOpportunityHeader />
      {cards}
      {!loading && filteredOpportunities.length === 0 && (
        <div>
          <div styleName="copilot-opportunity-bucket">
            <SortingSelectBar
              title={BUCKET_DATA[bucket].name}
              options={BUCKET_DATA[bucket].sorts.map(item => ({
                label: Sort[item].name,
                value: item,
              }))}
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
      )}
      {loadMore && !loading ? (
        <Waypoint onEnter={loadMore} />
      ) : null}
      {placeholders}
    </div>
  );
}

CopilotOpportunityBucket.defaultProps = {
  expandedTags: [],
  expandTag: null,
  keepPlaceholders: false,
  needLoad: false,
  loading: false,
  loadMore: null,
  sort: null,
};

CopilotOpportunityBucket.propTypes = {
  bucket: PT.string.isRequired,
  challengesUrl: PT.string.isRequired,
  expandedTags: PT.arrayOf(PT.number),
  expandTag: PT.func,
  //   filterState: PT.shape().isRequired,
  opportunities: PT.arrayOf(PT.shape()).isRequired,
  keepPlaceholders: PT.bool,
  needLoad: PT.bool,
  loading: PT.bool,
  loadMore: PT.func,
  setFilterState: PT.func.isRequired,
  setSort: PT.func.isRequired,
  sort: PT.string,
  setSearchText: PT.func.isRequired,
};
