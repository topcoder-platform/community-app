/**
 * Regular sidebar row.
 */

import _ from 'lodash';
// import { challenge as challengeUtils } from 'topcoder-react-lib';
import PT from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import { BUCKET_NAME } from 'utils/challenge-listing/buckets';
import './style.scss';

// const Filter = challengeUtils.filter;

function Bucket({
  active,
  bucket,
  // challenges,
  // disabled,
  onClick,
  // allActiveChallengesLoaded,
  meta,
}) {
  // let countEl;
  // if (!bucket.hideCount && !disabled) {
  // const filter = Filter.getFilterFunction(bucket.filter);
  // const clonedChallenges = _.clone(challenges);
  // const filteredChallenges = [];
  // for (let i = 0; i < clonedChallenges.length; i += 1) {
  // if (filter(clonedChallenges[i])) {
  // filteredChallenges.push(clonedChallenges[i]);
  // }
  // }
  let count = 0;
  // if (allActiveChallengesLoaded) {
  //   count = challenges.filter(filter).length;
  // } else {
  switch (bucket) {
    case 'all':
      count = meta.allChallengesCount;
      break;
    case 'my':
      count = meta.myChallengesCount;
      break;
    case 'openForRegistration':
      count = meta.openChallengesCount;
      break;
    case 'ongoing':
      count = meta.ongoingChallengesCount;
      break;
    default:
  // }
  }
  const countEl = (
    <span styleName="right">
      {count}
    </span>
  );
  // }

  // const error = Boolean(bucket.error) && (
  //   <div styleName="errorMsg">
  //     {bucket.error}
  //   </div>
  // );

  if (active) {
    return (
      <div styleName="active bucket">
        {BUCKET_NAME[bucket]}
        {countEl}
        {/* {error} */}
      </div>
    );
  }

  return (
    <div
      // onClick={disabled ? _.noop : onClick}
      onClick={onClick}
      onKeyPress={e => (e.key === 'Enter' ? onClick() : null)}
      role="button"
      styleName="bucket"
      tabIndex={0}
    >
      {BUCKET_NAME[bucket]}
      {countEl}
      {/* {error} */}
    </div>
  );
}

Bucket.defaultProps = {
  active: false,
  // disabled: false,
  onClick: _.noop,
  meta: {},
};

Bucket.propTypes = {
  active: PT.bool,
  bucket: PT.string.isRequired,
  // bucket: PT.shape({
  //   hideCount: PT.bool,
  //   name: PT.string.isRequired,
  //   error: PT.string,
  //   filter: PT.any,
  // }).isRequired,
  // // challenges: PT.arrayOf(PT.shape).isRequired,
  // disabled: PT.bool,
  onClick: PT.func,
  meta: PT.shape(),
  // allActiveChallengesLoaded: PT.bool.isRequired,
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
