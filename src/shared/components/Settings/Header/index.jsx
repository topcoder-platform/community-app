/**
 * Child component of Settings/Header renders summary of number of active challenges.
 * Also renders special badges based on achievements data.
*/
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import Badge, { MAP, XL_MAP } from '../../Dashboard/Header/Badge';

import './styles.scss';

export default function Header(props) {
  const {
    profileState,
    showXlBadge,
    xlBadge,
    activeChallengesCount,
  } = props;
  const achievements = profileState.achievements || [];
  const badges = achievements.filter(x => MAP[x.description]);
  const hasBadges = badges && badges.length;
  return (
    <div styleName="page-state-header">
      <header>
        <div styleName="page-info">
          <h1>Settings</h1>
        </div>
        <div styleName="info">
          <div styleName="badgeItem">
            {
              _.map(badges, ({ description }) => (
                <Badge
                  badge={MAP[description]}
                  key={description}
                  showXl={show => showXlBadge(show && description)}
                  title={description}
                  xlBadge={xlBadge === description && XL_MAP[xlBadge]}
                />
              ))
            }
          </div>
          <div styleName="separator" className={hasBadges ? '' : 'hidden'} />
          <div styleName="item">
            <div styleName="value">
              <p>{_.isNumber(activeChallengesCount) && activeChallengesCount >= 0 ? activeChallengesCount : ''}</p>
            </div>
            <div styleName="title">
              <p>Active Challenges</p>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

Header.defaultProps = {
  xlBadge: null,
  activeChallengesCount: -1,
};

Header.propTypes = {
  profileState: PT.shape().isRequired,
  showXlBadge: PT.func.isRequired,
  xlBadge: PT.string,
  activeChallengesCount: PT.number,
};

