/**
 * Regular sidebar row.
 */

import _ from 'lodash';
import { challenge as challengeUtil } from 'topcoder-react-lib';
import PT from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import './style.scss';

const Filter = challengeUtil.filter;

function Bucket({
  active,
  bucket,
  challenges,
  disabled,
  onClick,
  allActiveChallengesLoaded,
  meta,
}) {
  let countEl;
  if (!bucket.hideCount && !disabled) {
    const filter = Filter.getFilterFunction(bucket.filter);
    let count;
    if (allActiveChallengesLoaded) {
      count = challenges.filter(filter).length;
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
  }).isRequired,
  challenges: PT.arrayOf(PT.shape).isRequired,
  disabled: PT.bool,
  onClick: PT.func,
  meta: PT.shape(),
  allActiveChallengesLoaded: PT.bool.isRequired,
};

const mapStateToProps = (state) => {
  const cl = state.challengeListing;
  return {
    allActiveChallengesLoaded: cl.allActiveChallengesLoaded,
    meta: cl.meta,
  };
};

const BucketContainer = connect(
  mapStateToProps,
)(Bucket);

export default BucketContainer;
