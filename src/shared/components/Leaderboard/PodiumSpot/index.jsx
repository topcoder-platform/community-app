/**
 * Leaderboard PodiumSpot
 *
 * Description:
 *   Component that display a user's avatar, handle and challenge wins info
 *   It is designed to be used in the Podium component.
 *
 * Usage:
 *  <PodiumSpot competitor={competitor} />
 *
 * Props:
 *   - competitor (required): A Top Coder user object, with
 *     the following properties:
 *      - rank: Number, required. User current ranking in the leaderboard
 *      - photourl: String. URL for the user's profile picture
 *        This will default to the default user avatar is undefined
 *      - user.handle: String, required. User handle
 *      - challenge.count: Number, required. The number of challenge the user won
 *      - project_result.final_score: Number, required. The user's current score
 *   - isCopilot: Copilot leaderboards have special fields. This flag controlls
 *     if those should be displayed
 *   - onUsernameClick: Function if provided it is invoked with the clicked competitor
 *     instead of linking to member's profile
 *   - isTopGear: Topgear leaderboards have special fileds
 */

import React from 'react';
import PT from 'prop-types';
import { Avatar } from 'topcoder-react-ui-kit';
import { config } from 'topcoder-react-utils';

import avatarStyles from '../avatarStyles.scss';
import defaultStyles from './themes/styles.scss'; // eslint-disable-line
import tco20Styles from './themes/tco20.scss'; // eslint-disable-line

/**
 * Object used to add a CSS modifier (PodiumSpot--first) that will
 * modify the appearance of the PodiumSpot component based on used
 * ranking.
 */
const PODIUM_ITEM_MODIFIER = {
  1: 'first',
  2: 'second',
  3: 'third',
};

/**
 * Object used to reference the correct styling object
 * based based on user ranking.
 */
const CUSTOM_STYLES = {
  Default: {
    1: avatarStyles.gold,
    2: avatarStyles.silver,
    3: avatarStyles.bronze,
  },
  TCO20: {
    1: avatarStyles['tco20-1'],
    2: avatarStyles['tco20-2'],
    3: avatarStyles['tco20-3'],
  },
};

/**
 * Object used to get the proper string to display based on user ranking.
 */
const DISPLAY_RANKING = {
  1: '1',
  2: '2',
  3: '3',
};

const THEME = {
  Default: 'defaultStyles',
  TCO20: 'tco20Styles',
};

/**
 * Format points number
 * @param {Number} points points number
 */
const formatPoints = points => parseFloat(Math.round(points * 100) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
export default function PodiumSpot(props) {
  const {
    competitor,
    isCopilot,
    onUsernameClick,
    isTopGear,
    isAlgo,
    themeName,
  } = props;

  const stylesName = THEME[themeName];
  let photoUrl = competitor.avatar;
  if (photoUrl) {
    photoUrl = `${config.CDN.PUBLIC}/avatar/${
      encodeURIComponent(photoUrl)}?size=160`;
  }
  let rootStyle = `${stylesName}.PodiumSpot`;
  if (PODIUM_ITEM_MODIFIER[competitor.rank]) rootStyle += ` ${stylesName}.PodiumSpot--${PODIUM_ITEM_MODIFIER[competitor.rank]}`;

  return (
    <div styleName={rootStyle}>
      <span styleName={`${stylesName}.leaderboard-avatar`}>
        <Avatar
          theme={{
            avatar: CUSTOM_STYLES[themeName][competitor.rank],
          }}
          url={photoUrl}
        />
        <div styleName={`${stylesName}.ranking`}>{DISPLAY_RANKING[competitor.rank]}</div>
      </span>
      {
        themeName === 'Default' ? (
          <div>
            {
              onUsernameClick ? (
                <div
                  styleName={`${stylesName}.handle-link`}
                  onClick={() => onUsernameClick(competitor)}
                >
                  {competitor.handle}
                </div>
              ) : (
                <a styleName={`${stylesName}.profile-link`} href={`${config.URL.BASE}/members/${competitor.handle}/`}>
                  {competitor.handle}
                </a>
              )
            }
          </div>
        ) : null
      }
      <div styleName={`${stylesName}.winnings-info`} style={isTopGear ? { 'flex-direction': 'column' } : null}>
        {
          themeName !== 'Default' ? (
            <div>
              {
                onUsernameClick ? (
                  <div
                    styleName={`${stylesName}.handle-link`}
                    onClick={() => onUsernameClick(competitor)}
                  >
                    {competitor.handle}
                  </div>
                ) : (
                  <a styleName={`${stylesName}.profile-link`} href={`${config.URL.BASE}/members/${competitor.handle}/`}>
                    {competitor.handle}
                  </a>
                )
              }
            </div>
          ) : null
        }
        {
          isCopilot ? (
            <div styleName={`${stylesName}.stats`}>
              <span styleName={`${stylesName}.value`}>{competitor.fulfillment}</span>
              <span>fulfillment</span>
            </div>
          ) : null
        }
        <div styleName={`${stylesName}.stats`}>
          <span styleName={`${stylesName}.value`}>{competitor.challengecount}</span>
          <span styleName={`${stylesName}.value-title`}>challenges</span>
        </div>
        <div styleName={`${stylesName}.stats`}>
          <span styleName={`${stylesName}.value`}>{formatPoints(competitor.points)}</span>
          <span styleName={`${stylesName}.value-title`}>points</span>
        </div>
        {
          isTopGear ? (
            <div styleName={`${stylesName}.stats`}>
              <span styleName={`${stylesName}.value`}>{competitor.wins}</span>
              <span styleName={`${stylesName}.value-title`}>wins</span>
            </div>
          ) : null
        }
        {
          isTopGear ? (
            <div styleName={`${stylesName}.stats`}>
              <span styleName={`${stylesName}.value`}>{competitor.total_earnings}</span>
              <span styleName={`${stylesName}.value-title`}>total earnings</span>
            </div>
          ) : null
        }
        {
          isAlgo ? (
            <div styleName={`${stylesName}.stats`}>
              <span styleName={`${stylesName}.value`}>{competitor['srm_tco19.score']}</span>
              <span styleName={`${stylesName}.value-title`}>total score</span>
            </div>
          ) : null
        }
      </div>
    </div>
  );
}

/* eslint-enable jsx-a11y/click-events-have-key-events */
/* eslint-enable jsx-a11y/no-static-element-interactions */

const CompetitorShape = PT.shape({
  rank: PT.number.isRequired,
  avatar: PT.string,
  handle: PT.string.isRequired,
  challengecount: PT.number.isRequired,
  points: PT.number.isRequired,
});

PodiumSpot.propTypes = {
  competitor: CompetitorShape.isRequired,
  isCopilot: PT.bool,
  onUsernameClick: PT.func,
  isTopGear: PT.bool,
  isAlgo: PT.bool,
  themeName: PT.string.isRequired,
};

PodiumSpot.defaultProps = {
  isCopilot: false,
  onUsernameClick: null,
  isTopGear: false,
  isAlgo: false,
};
