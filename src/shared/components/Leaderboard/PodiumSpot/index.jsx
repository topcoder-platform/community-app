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
import PT, { number } from 'prop-types';
import { Avatar } from 'topcoder-react-ui-kit';
import { config } from 'topcoder-react-utils';
import _ from 'lodash';
import DefaultAvatar from 'assets/images/default-avatar-photo.svg';
import { getRatingColor } from 'utils/tc';

import avatarStyles from '../avatarStyles.scss';
import defaultStyles from './themes/styles.scss'; // eslint-disable-line
import tco20Styles from './themes/tco20.scss'; // eslint-disable-line
import tco22Styles from './themes/tco22.scss'; // eslint-disable-line
import tco23Styles from './themes/tco23.scss'; // eslint-disable-line

/**
 * Object used to add a CSS modifier (PodiumSpot--first) that will
 * modify the appearance of the PodiumSpot component based on used
 * ranking.
 */
const PODIUM_ITEM_MODIFIER = {
  1: 'first',
  2: 'second',
  3: 'third',
  4: 'fourth',
  5: 'fifth',
  6: 'sixt',
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
    4: avatarStyles.iron,
  },
  TCO20: {
    1: avatarStyles['tco20-1'],
    2: avatarStyles['tco20-2'],
    3: avatarStyles['tco20-3'],
    4: avatarStyles['tco20-4'],
  },
  TCO22: {
    1: avatarStyles['tco22-1'],
    2: avatarStyles['tco22-2'],
    3: avatarStyles['tco22-3'],
    4: avatarStyles['tco22-4'],
  },
  TCO23: {
    1: avatarStyles['tco23-1'],
    2: avatarStyles['tco23-2'],
    3: avatarStyles['tco23-3'],
    4: avatarStyles['tco23-4'],
    5: avatarStyles['tco23-5'],
    6: avatarStyles['tco23-6'],
  },
};

/**
 * Object used to get the proper string to display based on user ranking.
 */
const DISPLAY_RANKING = {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
};

const THEME = {
  Default: 'defaultStyles',
  TCO20: 'tco20Styles',
  TCO22: 'tco22Styles',
  TCO23: 'tco23Styles',
};

const DISPLAY_RANKING_NUM = {
  1: '1ST',
  2: '2ND',
  3: '3RD',
  4: '4TH',
  5: '5TH',
  6: '6TH',
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
    podiumPlaces,
  } = props;

  const stylesName = THEME[themeName];
  const tcoPoints = competitor['tco23_leaderboard.tco_points']
    || competitor['tco_leaderboard.tco_points']
    || competitor.points
    || competitor['tco_leaderboard.total_score']
    || competitor['srm_tco19.score'];
  const tcoChallengeCnt = competitor['tco23_leaderboard.challenge_count'] || competitor['tco_leaderboard.challenge_count'] || competitor.challengecount;
  let photoUrl = competitor['member_profile_basic.photo_url'] || competitor.avatar;
  if (photoUrl) {
    photoUrl = `${config.CDN.PUBLIC}/avatar/${encodeURIComponent(photoUrl)}?size=160`;
  }
  let rootStyle = `${stylesName}.${podiumPlaces > 3 ? 'PodiumSpotCondense' : 'PodiumSpot'}`;
  if (PODIUM_ITEM_MODIFIER[competitor.rank]) rootStyle += ` ${stylesName}.PodiumSpot--${PODIUM_ITEM_MODIFIER[competitor.rank]}`;
  const fulfillment = competitor['tco_leaderboard.fulfillment']
    ? (parseFloat(competitor['tco_leaderboard.fulfillment']) * 100).toFixed(2).replace(/[.,]00$/, '')
    : competitor.fulfillment;
  const rating = competitor['member_profile_basic.max_rating'];
  return themeName === 'TCO23' ? (
    <div styleName={rootStyle}>
      {
        competitor.rank <= 6 && <h3 styleName={`${stylesName}.place`}>{`${DISPLAY_RANKING_NUM[competitor.rank]} PLACE`}</h3>
      }
      {
        onUsernameClick ? (
          <div
            styleName={`${stylesName}.handle-link`}
            onClick={() => onUsernameClick(competitor)}
            style={{ color: rating !== undefined ? getRatingColor(rating) : null }}
          >
            {competitor['member_profile_basic.handle'] || competitor.handle}
          </div>
        ) : (
          <a
            styleName={`${stylesName}.profile-link`}
            href={`${window.origin}/members/${competitor['member_profile_basic.handle'] || competitor.handle}/`}
            target={`${_.includes(window.origin, 'www') ? '_self' : '_blank'}`}
            style={{ color: rating !== undefined ? getRatingColor(rating) : null }}
          >
            {competitor['member_profile_basic.handle'] || competitor.handle}
          </a>
        )
      }
      <div styleName={`${stylesName}.wave-wrap--${PODIUM_ITEM_MODIFIER[competitor.rank > 4 ? 4 : competitor.rank]}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={podiumPlaces > 3 ? 200 : 392}
          height={podiumPlaces > 3 ? 16 : 25}
          fill="none"
          viewBox={`0 0 ${podiumPlaces > 3 ? 200 : 392} ${podiumPlaces > 3 ? 16 : 25}`}
        >
          {
            podiumPlaces > 3 ? (
              <path
                fill="#fff"
                d="M149.572 0.823649C173.331 0.823652 191.313 6.86156 198 9.88051L198 0.0893164L7.94832e-07 0.0892861L3.05705e-07 9.88048C6.08897 12.3283 17.0268 16 38.0337 16C64.2924 16 122.203 0.823644 149.572 0.823649Z"
              />
            ) : (
              <path
                fill="#fff"
                d="M296.123 1.385c47.038 0 82.638 9.395 95.877 14.093V.242H0v15.236C12.055 19.287 33.71 25 75.3 25c51.986 0 166.637-23.615 220.823-23.615z"
              />
            )
          }
        </svg>
        <span styleName={`${stylesName}.leaderboard-avatar`}>
          {
            photoUrl ? (
              <Avatar
                theme={{
                  avatar: CUSTOM_STYLES[themeName][competitor.rank],
                }}
                url={photoUrl}
              />
            ) : <DefaultAvatar />
          }
          <div styleName={`${stylesName}.ranking`}>{DISPLAY_RANKING[competitor.rank]}</div>
        </span>
        <div styleName={`${stylesName}.winnings-info`}>
          {
            isCopilot ? (
              <div styleName={`${stylesName}.stats`}>
                <span styleName={`${stylesName}.value`}>{fulfillment}</span>
                <span styleName={`${stylesName}.value-title`}>fulfillment</span>
              </div>
            ) : null
          }
          {
            isAlgo ? (
              <div styleName={`${stylesName}.stats`} style={{ alignItems: 'flex-start' }}>
                <span styleName={`${stylesName}.value`}>{tcoPoints}</span>
                <span styleName={`${stylesName}.value-title`}>total score</span>
              </div>
            ) : null
          }
          <div styleName={`${stylesName}.stats`} style={{ alignItems: 'flex-start' }}>
            <span styleName={`${stylesName}.value`}>{formatPoints(tcoPoints)}</span>
            <span styleName={`${stylesName}.value-title`}>points</span>
          </div>
          <div styleName={`${stylesName}.stats`}>
            <span styleName={`${stylesName}.value`}>{tcoChallengeCnt}</span>
            {
              isAlgo ? (
                <span styleName={`${stylesName}.value-title`}>matches</span>
              ) : (
                <span styleName={`${stylesName}.value-title`}>challenges</span>
              )
            }
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div styleName={rootStyle}>
      <span styleName={`${stylesName}.leaderboard-avatar`}>
        {
          photoUrl ? (
            <Avatar
              theme={{
                avatar: CUSTOM_STYLES[themeName][competitor.rank],
              }}
              url={photoUrl}
            />
          ) : <DefaultAvatar />
        }
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
                  {competitor['member_profile_basic.handle'] || competitor.handle}
                </div>
              ) : (
                <a
                  styleName={`${stylesName}.profile-link`}
                  href={`${window.origin}/members/${competitor['member_profile_basic.handle'] || competitor.handle}/`}
                  target={`${_.includes(window.origin, 'www') ? '_self' : '_blank'}`}
                >
                  {competitor['member_profile_basic.handle'] || competitor.handle}
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
                    style={{ color: rating !== undefined ? getRatingColor(rating) : null }}
                  >
                    {competitor['member_profile_basic.handle'] || competitor.handle}
                  </div>
                ) : (
                  <a
                    styleName={`${stylesName}.profile-link`}
                    href={`${window.origin}/members/${competitor['member_profile_basic.handle'] || competitor.handle}/`}
                    target={`${_.includes(window.origin, 'www') ? '_self' : '_blank'}`}
                    style={{ color: rating !== undefined ? getRatingColor(rating) : null }}
                  >
                    {competitor['member_profile_basic.handle'] || competitor.handle}
                  </a>
                )
              }
            </div>
          ) : null
        }
        {
          isCopilot ? (
            <div styleName={`${stylesName}.stats-count`}>
              <span styleName={`${stylesName}.value`}>{fulfillment}</span>
              <span styleName={`${stylesName}.value-title`}>fulfillment</span>
            </div>
          ) : null
        }
        <div styleName={`${stylesName}.stats-count`}>
          <span styleName={`${stylesName}.value`}>{tcoChallengeCnt}</span>
          {
            isAlgo ? (
              <span styleName={`${stylesName}.value-title`}># of matches</span>
            ) : (
              <span styleName={`${stylesName}.value-title`}>challenges</span>
            )
          }
        </div>
        <div styleName={`${stylesName}.stats`}>
          <span styleName={`${stylesName}.value`}>{formatPoints(tcoPoints)}</span>
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
              <span styleName={`${stylesName}.value`}>{tcoPoints}</span>
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
  themeName: PT.string,
  podiumPlaces: number,
};

PodiumSpot.defaultProps = {
  isCopilot: false,
  onUsernameClick: null,
  isTopGear: false,
  isAlgo: false,
  themeName: 'Default',
  podiumPlaces: 1,
};
