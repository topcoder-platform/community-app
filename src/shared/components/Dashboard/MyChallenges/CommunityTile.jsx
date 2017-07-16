/* eslint-disable global-require, import/no-dynamic-require */

import React from 'react';
import PT from 'prop-types';
import cn from 'classnames';

import './CommunityTile.scss';

const CommunityTile = (props) => {
  const { community, stats, registered } = props;
  return (<div styleName="container">
    <div styleName="left" >
      <img src={require(`assets/images/tc-communities/background/${community.image}`)} alt="" />
      <div styleName="name">{community.communityName}</div>
      <div styleName="desc">{community.description}</div>
      <a target="_blank" styleName="learn-more" href={`/community/${community.communityId}/home`}>Learn more</a>
    </div>
    <div styleName="right">
      <div styleName="stats">
        <div styleName="stats-item">
          <div styleName="value">{stats.numMembers}</div>
          <div styleName="label">Registrants</div>
        </div>
        <div styleName="stats-item">
          <div styleName="value">{stats.numChallenges}</div>
          <div styleName="label">Challenges</div>
        </div>
        <div styleName="stats-item">
          <div styleName="value">{stats.openPrizes}</div>
          <div styleName="label">Purse Cash</div>
        </div>
      </div>
      <div styleName="actions">
        <a styleName={cn({ reg: !registered, unreg: registered })}>{registered ? 'Unregister' : 'Register'}</a>
        <a styleName="link" target="_blank" href={`/community/${community.communityId}/challenges`}>View All Challenges</a>
        <div styleName="pipe" />
        <a styleName="link" target="_blank" href={`/community/${community.communityId}/leaderboard`}>Leaderboard</a>
      </div>
    </div>
  </div>);
};

CommunityTile.propTypes = {
  stats: PT.shape(),
  community: PT.shape(),
  registered: PT.bool,
};

CommunityTile.defaultProps = {
  stats: {},
  community: {},
  registered: false,
};

export default CommunityTile;
