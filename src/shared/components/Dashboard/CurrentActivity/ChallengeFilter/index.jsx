/* eslint jsx-a11y/no-static-element-interactions:0 */

import React from 'react';
import PT from 'prop-types';
import Sticky from 'react-stickynode';

import './style.scss';

export default function ChallengeFilter({
  communities,
  expand,
  expanded,
  selectedCommunityId,
  selectCommunity,
}) {
  if (!expanded) {
    return (
      <div
        onMouseEnter={() => expand(true)}
        styleName="button"
      >F</div>
    );
  }

  let containerStyle = 'container';
  if (expanded) containerStyle += ' expanded';

  return (
    <div
      onMouseLeave={() => expand(false)}
      styleName={containerStyle}
    >
      {
        communities.map(community => (
          <div
            key={community.communityId}
            onClick={() => selectCommunity(community.communityId)}
            styleName={`row ${community.communityId === selectedCommunityId ? 'selected' : ''}`}
          >
            <span>{community.communityName}</span>
            <span>{community.number}</span>
          </div>
        ))
      }
    </div>
  );
};

ChallengeFilter.defaultProps = {
  communities: [],
  expanded: false,
  selectedCommunityId: '',
};

ChallengeFilter.propTypes = {
  communities: PT.arrayOf(PT.shape({
    communityId: PT.string.isRequired,
    communityName: PT.string.isRequired,
    number: PT.number.isRequired,
  })),
  expand: PT.func.isRequired,
  expanded: PT.bool,
  selectedCommunityId: PT.string,
  selectCommunity: PT.func.isRequired,
};
