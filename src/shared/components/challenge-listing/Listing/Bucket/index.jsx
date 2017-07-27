/**
 * A single bucket of challenges.
 */

import _ from 'lodash';
import PT from 'prop-types';
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
  challenges,
  expanded,
  expand,
  loading,
  loadMore,
  setFilterState,
  setSort,
  sort,
}) {
  const filter = getFilterFunction(bucket.filter);
  const activeSort = sort || bucket.sorts[0];

  const sortedChallenges = _.clone(challenges);
  sortedChallenges.sort(Sort[activeSort].func);

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
      onTechTagClicked={tag => setFilterState({ tags: [tag] })}
      key={item.id}
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
        (expandable || loadMore) && !expanded ? (
          <button
            onClick={expand}
            styleName="view-more"
          >View more challenges</button>
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
  expanded: false,
  expand: _.noop,
  loading: false,
  loadMore: null,
  sort: null,
};

Bucket.propTypes = {
  bucket: PT.shape().isRequired,
  expanded: PT.bool,
  expand: PT.func,
  challenges: PT.arrayOf(PT.shape()).isRequired,
  loading: PT.bool,
  loadMore: PT.func,
  setFilterState: PT.func.isRequired,
  setSort: PT.func.isRequired,
  sort: PT.string,
};
