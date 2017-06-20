/**
 * A single bucket of challenges.
 */

import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import sort from 'utils/challenge-listing/sort';
import SortingSelectBar from 'components/SortingSelectBar';
import { getFilterFunction } from 'utils/challenge-listing/filter';
import ChallengeCard from '../../ChallengeCard';
import './style.scss';

const COLLAPSED_SIZE = 10;

export default function Bucket({ bucket, challenges, expanded }) {
  const filter = getFilterFunction(bucket.filter);

  let expandable = false;
  const filteredChallenges = [];
  for (let i = 0; i < challenges.length; i += 1) {
    if (filter(challenges[i])) filteredChallenges.push(challenges[i]);
    if (!expanded && filteredChallenges.length >= COLLAPSED_SIZE) {
      expandable = true;
      break;
    }
  }

  if (!filteredChallenges.length) return null;

  const cards = filteredChallenges.map(item => (
    <ChallengeCard
      challenge={item}
      onTechTagClicked={_.noop}
      key={item.id}
    />
  ));

  return (
    <div styleName="bucket">
      <SortingSelectBar
        options={bucket.sorts.map(item => sort[item].name)}
        title={bucket.name}
        value={sort[bucket.sorts[0]].name}
      />
      {cards}
      {
        expandable ? (
          <button styleName="view-more">View more challenges</button>
        ) : null
      }
    </div>
  );
}

Bucket.defaultProps = {
  expanded: false,
};

Bucket.propTypes = {
  bucket: PT.shape().isRequired,
  expanded: PT.bool,
  challenges: PT.arrayOf(PT.shape()).isRequired,
};
