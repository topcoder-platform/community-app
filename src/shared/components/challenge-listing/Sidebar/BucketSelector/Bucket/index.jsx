/**
 * Regular sidebar row.
 */

import _ from 'lodash';
import { challenge as challengeUtils } from 'topcoder-react-lib';
import PT from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import './style.scss';

const Filter = challengeUtils.filter;

function Bucket({
  active,
  bucket,
  challenges,
  myChallenges,
  allMyChallenges,
  disabled,
  onClick,
  allActiveChallengesLoaded,
  allMyChallengesLoaded,
  meta,
}) {
  let countEl;
  if (!bucket.hideCount && !disabled) {
    const filter = Filter.getFilterFunction(bucket.filter);
    const allFilter = Filter.getFilterFunction(bucket.allFilter);
    let count;
    if (
      (allMyChallengesLoaded && bucket.name === 'My Challenges')
      || (allMyChallenges.length > 0 && bucket.name === 'My Challenges')
    ) {
      count = myChallenges.filter(filter).length;
    } else if (allActiveChallengesLoaded && bucket.name !== 'My Challenges') {
      if (bucket.name === 'My Challenges') {
        count = challenges.filter(allFilter).length;
      } else {
        count = challenges.filter(filter).length;
      }
    } else {
      switch (bucket.name) {
        case 'All Challenges':
          count = meta.allChallengesCount;
          break;
        case 'My Challenges':
          count = meta.myChallengesCount;
          break;
        case 'Open for registration':
          count = meta.openChallengesCount;
          break;
        case 'Ongoing challenges':
          count = meta.ongoingChallengesCount;
          break;
        default:
      }
    }
    countEl = (
      <span styleName="right">
        {count}
      </span>
    );
  }

  const error = Boolean(bucket.error) && (
    <div styleName="errorMsg">
      {bucket.error}
    </div>
  );

  if (active) {
    return (
      <div styleName="active bucket">
        {bucket.name}
        {countEl}
        {error}
      </div>
    );
  }

  return (
    <div
      onClick={disabled ? _.noop : onClick}
      onKeyPress={e => (e.key === 'Enter' ? onClick() : null)}
      role="button"
      styleName="bucket"
      tabIndex={0}
    >
      {bucket.name}
      {countEl}
      {error}
    </div>
  );
}

Bucket.defaultProps = {
  active: false,
  disabled: false,
  onClick: _.noop,
  meta: {},
};

Bucket.propTypes = {
  active: PT.bool,
  bucket: PT.shape({
    hideCount: PT.bool,
    name: PT.string.isRequired,
    error: PT.string,
    filter: PT.any,
    allFilter: PT.any,
  }).isRequired,
  challenges: PT.arrayOf(PT.shape).isRequired,
  myChallenges: PT.arrayOf(PT.shape).isRequired,
  allMyChallenges: PT.arrayOf(PT.shape).isRequired,
  disabled: PT.bool,
  onClick: PT.func,
  meta: PT.shape(),
  allActiveChallengesLoaded: PT.bool.isRequired,
  allMyChallengesLoaded: PT.bool.isRequired,
};

const mapStateToProps = (state) => {
  const cl = state.challengeListing;
  return {
    allActiveChallengesLoaded: cl.allActiveChallengesLoaded,
    allMyChallengesLoaded: cl.allMyChallengesLoaded,
    meta: cl.meta,
  };
};

const BucketContainer = connect(
  mapStateToProps,
)(Bucket);

export default BucketContainer;
