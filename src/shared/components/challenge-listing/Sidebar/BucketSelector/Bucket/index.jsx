/**
 * Regular sidebar row.
 */

import _ from 'lodash';
// import { challenge as challengeUtils } from 'topcoder-react-lib';
import { BUCKETS, BUCKET_DATA } from 'utils/challenge-listing/buckets';
import PT from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import './style.scss';

// const Filter = challengeUtils.filter;

function Bucket({
  active,
  bucket,
  // challenges,
  disabled,
  onClick,
  // allActiveChallengesLoaded,
  meta,
}) {
  // let countEl;
  // if (!disabled) { // !bucket.hideCount &&
  // const filter = Filter.getFilterFunction(bucket.filter);
  // const clonedChallenges = _.clone(challenges);
  // const filteredChallenges = [];
  // for (let i = 0; i < clonedChallenges.length; i += 1) {
  // if (filter(clonedChallenges[i])) {
  //   filteredChallenges.push(clonedChallenges[i]);
  // }
  // }
  let count;
  // if (allActiveChallengesLoaded) {
  // count = challenges.filter(filter).length;
  // } else {
  switch (bucket) {
    case BUCKETS.ALL:
      count = meta.allChallengesCount;
      break;
    case BUCKETS.MY:
      count = meta.myChallengesCount;
      break;
    case BUCKETS.OPEN_FOR_REGISTRATION:
      count = meta.openChallengesCount;
      break;
    case BUCKETS.ONGOING:
      count = meta.ongoingChallengesCount;
      break;
    case BUCKETS.MY_PAST:
      count = meta.myPastChallengesCount;
      break;
    default:
  }
  // }
  // }

  // const error = Boolean(bucket.error) && (
  //   <div styleName="errorMsg">
  //     {bucket.error}
  //   </div>
  // );

  // if (active) {
  //   return (
  //     <div styleName="active bucket">
  //       {BUCKET_DATA[bucket].name}
  //       {bucket !== BUCKETS.ALL && countEl}
  //     </div>
  //   );
  // }

  return (
    <div
      onClick={disabled ? _.noop : onClick}
      onKeyPress={(e) => {
        e.stopPropagation();
        return (e.key === 'Enter' ? onClick() : null);
      }}
      role="button"
      styleName="bucket"
      tabIndex={0}
    >
      <input
        type="radio"
        checked={active}
        onClick={() => {
          onClick();
        }}
      />
      <span styleName="bucketName">{BUCKET_DATA[bucket].name}</span>
      {(bucket !== BUCKETS.ALL && count > 0) ? <span styleName="count">{count}</span> : null}
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
  bucket: PT.string.isRequired,
  // bucket: PT.shape({
  //   // hideCount: PT.bool,
  //   name: PT.string.isRequired,
  //   error: PT.string,
  //   filter: PT.any,
  // }).isRequired,
  // challenges: PT.arrayOf(PT.shape).isRequired,
  disabled: PT.bool,
  onClick: PT.func,
  meta: PT.shape(),
  // allActiveChallengesLoaded: PT.bool.isRequired,
};

const mapStateToProps = (state) => {
  const cl = state.challengeListing;
  return {
    // allActiveChallengesLoaded: cl.allActiveChallengesLoaded,
    meta: cl.meta,
  };
};

const BucketContainer = connect(
  mapStateToProps,
)(Bucket);

export default BucketContainer;
