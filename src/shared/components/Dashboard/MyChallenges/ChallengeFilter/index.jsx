/* eslint jsx-a11y/no-static-element-interactions:0 */

import React from 'react';
import PT from 'prop-types';

import './style.scss';

const ChallengeFilter = (props) => {
  const { communities, selectedCommunityId, selectCommunity } = props;
  return (
    <div styleName="container">
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

ChallengeFilter.propTypes = {
  communities: PT.arrayOf(PT.shape({
    communityId: PT.string.isRequired,
    communityName: PT.string.isRequired,
    number: PT.number.isRequired,
  })),
  selectedCommunityId: PT.string,
  selectCommunity: PT.func.isRequired,
};

ChallengeFilter.defaultProps = {
  communities: [],
  selectedCommunityId: '',
};

export default ChallengeFilter;
