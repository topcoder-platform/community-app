/* eslint jsx-a11y/no-static-element-interactions:0 */

import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import PT from 'prop-types';

import FilterIcon from '../../../../../assets/images/filter-icon.svg';

import './style.scss';

export default function ChallengeFilter({
  challengeFilter,
  communities,
  communitiesLoading,
  expand,
  expanded,
  switchChallengeFilter,
}) {
  if (!expanded) {
    return (
      <div
        onMouseEnter={() => expand(true)}
        styleName="button"
      ><FilterIcon /></div>
    );
  }

  return (
    <div
      onMouseLeave={() => expand(false)}
      styleName="container"
    >
      {
        communitiesLoading ? (
          <LoadingIndicator />
        ) : (
          communities.map(community => (
            <div
              key={community.communityId}
              onClick={() => switchChallengeFilter(community.communityId)}
              styleName={`row ${community.communityId === challengeFilter ? 'selected' : ''}`}
            >
              <span>{community.communityName}</span>
              <span>{community.number}</span>
            </div>
          ))
        )
      }
    </div>
  );
}

ChallengeFilter.defaultProps = {
  communities: [],
  expanded: false,
};

ChallengeFilter.propTypes = {
  challengeFilter: PT.string.isRequired,
  communities: PT.arrayOf(PT.shape({
    communityId: PT.string.isRequired,
    communityName: PT.string.isRequired,
    number: PT.number.isRequired,
  })),
  communitiesLoading: PT.bool.isRequired,
  expand: PT.func.isRequired,
  expanded: PT.bool,
  switchChallengeFilter: PT.func.isRequired,
};
