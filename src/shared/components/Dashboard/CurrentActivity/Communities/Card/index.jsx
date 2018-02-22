/* eslint-disable global-require, import/no-dynamic-require */

import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';

import './style.scss';

const CommunityTile = (props) => {
  const { community, stats, statsLoading /* , registered */ } = props;
  return (<div styleName="container">
    <div styleName="left" >
      <img src={require(`assets/images/tc-communities/background/${community.image}`)} alt="" />
      <div styleName="name">{community.communityName}</div>
      <div styleName="desc">{community.description}</div>
      <a rel="noopener noreferrer" target="_blank" styleName="learn-more" href={`/community/${community.communityId}/home`}>Learn more</a>
    </div>
    <div styleName="right">
      <div styleName="stats">
        {
          statsLoading ? (
            <LoadingIndicator />
          ) : (
            <div styleName="statsInner">
              <div styleName="stats-item">
                <div styleName="value">{stats.numMembers || 0}</div>
                <div styleName="label">Registrants</div>
              </div>
              <div styleName="stats-item">
                <div styleName="value">{stats.numChallenges || 0}</div>
                <div styleName="label">Challenges</div>
              </div>
              <div styleName="stats-item">
                <div styleName="value">{stats.openPrizes || '$0'}</div>
                <div styleName="label">Purse Cash</div>
              </div>
            </div>
          )
        }
      </div>
      <div styleName="actions">
        {
          /* TODO: Register / unregister button for non-registered communities */
        }
        <a rel="noopener noreferrer" styleName="link" target="_blank" href={`/community/${community.communityId}/challenges`}>View All Challenges</a>
        {
          /*
            <div styleName="pipe" />
            <a rel="noopener noreferrer" styleName="link" target="_blank"
            href={`/community/${community.communityId}/leaderboard`}>Leaderboard</a>
          */
        }
      </div>
    </div>
  </div>);
};

CommunityTile.propTypes = {
  stats: PT.shape(),
  statsLoading: PT.bool.isRequired,
  community: PT.shape({
    communityId: PT.string.isRequired,
    communityName: PT.string.isRequired,
    description: PT.string.isRequired,
    image: PT.string.isRequired,
  }),
  // registered: PT.bool,
};

CommunityTile.defaultProps = {
  stats: {},
  community: {},
  registered: false,
};

export default CommunityTile;
