/**
 * Leaderboard Table
 *
 * Description:
 *   Table that displays user ranking
 *
 * Usage:
 *   <LeaderboardTable competitors={this.props.competitors} />
 *
 * Props:
 *   - competitors (required): Array of Top Coder user object, with
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
import DefaultAvatar from 'assets/images/default-avatar-photo.svg';
import { getRatingColor } from 'utils/tc';


import avatarStyles from '../avatarStyles.scss';
import defaultStyles from './themes/styles.scss'; // eslint-disable-line
import tco20Styles from './themes/tco20.scss'; // eslint-disable-line
import tco22Styles from './themes/tco22.scss'; // eslint-disable-line
import tco23Styles from './themes/tco23.scss'; // eslint-disable-line

const THEME = {
  Default: 'defaultStyles',
  TCO20: 'tco20Styles',
  TCO22: 'tco22Styles',
  TCO23: 'tco23Styles',
};

/**
 * Format points number
 * @param {Number} points points number
 */
const formatPoints = points => parseFloat(Math.round(points * 100) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
export default function LeaderboardTable(props) {
  const {
    competitors,
    isCopilot,
    onUsernameClick,
    isTopGear,
    isAlgo,
    themeName,
  } = props;
  const stylesName = THEME[themeName];
  /* eslint-disable no-confusing-arrow */
  /* eslint-disable no-nested-ternary */
  const addSufix = val => isAlgo ? (val !== 1 ? `${val} matches` : `${val} match`) : (val !== 1 ? `${val} challenges` : `${val} challenge`);
  const renderTableRows = comps => (
    comps.map((competitor) => {
      const tcoPoints = competitor['tco23_leaderboard.tco_points']
        || competitor['tco_leaderboard.tco_points']
        || competitor.points
        || competitor['tco_leaderboard.total_score']
        || competitor['srm_tco19.score'];
      const tcoChallengeCnt = competitor['tco23_leaderboard.challenge_count'] || competitor['tco_leaderboard.challenge_count'] || competitor.challengecount;
      let photoUrl = competitor['member_profile_basic.photo_url'] || competitor.avatar;
      if (photoUrl) {
        photoUrl = `${config.CDN.PUBLIC}/avatar/${encodeURIComponent(photoUrl)}?size=40`;
      }
      const fulfillment = competitor['tco_leaderboard.fulfillment']
        ? (parseFloat(competitor['tco_leaderboard.fulfillment']) * 100).toFixed(2).replace(/[.,]00$/, '')
        : competitor.fulfillment;
      const rating = competitor['member_profile_basic.max_rating'];
      return (
        <tr key={competitor.rank}>
          <td styleName={`${stylesName}.col-rank`}><span>{competitor.rank}</span></td>
          <td styleName={`${stylesName}.col-avatar`}>
            <span styleName={`${stylesName}.leaderboard-avatar`}>
              {
                photoUrl ? (
                  <Avatar
                    theme={{
                      avatar: themeName === 'TCO22' ? avatarStyles['default-tco22'] : avatarStyles.default,
                    }}
                    url={photoUrl}
                  />
                ) : <DefaultAvatar />
              }
            </span>
          </td>
          <td styleName={`${stylesName}.col-handle`}>
            {
              onUsernameClick && themeName !== 'TCO23' ? (
                <div
                  styleName={`${stylesName}.handle-link`}
                  onClick={() => onUsernameClick(competitor)}
                  style={{ color: rating !== undefined ? getRatingColor(rating) : null }}
                >
                  {
                    themeName === 'TCO23' && (
                      <span styleName={`${stylesName}.leaderboard-avatar`}>
                        {
                          photoUrl ? (
                            <Avatar
                              theme={{
                                avatar: themeName === 'TCO22' ? avatarStyles['default-tco22'] : avatarStyles.default,
                              }}
                              url={photoUrl}
                            />
                          ) : <DefaultAvatar />
                        }
                      </span>
                    )
                  }
                  {competitor['member_profile_basic.handle'] || competitor.handle}
                </div>
              ) : (
                <a
                  href={`${config.URL.BASE}/members/${competitor['member_profile_basic.handle'] || competitor.handle}/`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: rating !== undefined ? getRatingColor(rating) : null }}
                >
                  {
                    themeName === 'TCO23' && (
                      <span styleName={`${stylesName}.leaderboard-avatar`}>
                        {
                          photoUrl ? (
                            <Avatar
                              theme={{
                                avatar: themeName === 'TCO22' ? avatarStyles['default-tco22'] : avatarStyles.default,
                              }}
                              url={photoUrl}
                            />
                          ) : <DefaultAvatar />
                        }
                      </span>
                    )
                  }
                  {competitor['member_profile_basic.handle'] || competitor.handle}
                </a>
              )
            }
            <div styleName={`${stylesName}.winnings-info`}>
              {fulfillment && (<span>{fulfillment} fulfillment</span>)}
              <span>{tcoPoints} points</span>
              {
                themeName === 'TCO23' ? (
                  <div onClick={() => onUsernameClick(competitor)} styleName={`${stylesName}.mobile-link`}>
                    {addSufix(tcoChallengeCnt)}
                  </div>
                ) : <span>{addSufix(tcoChallengeCnt)}</span>
              }
            </div>
          </td>
          {
            isCopilot ? (
              <td styleName={`${stylesName}.col-fulfillment`}>{fulfillment}</td>
            ) : null
          }
          <td styleName={`${stylesName}.col-challenges`}>
            {
              themeName === 'TCO23' ? (
                /* eslint-disable operator-linebreak */
                onUsernameClick ?
                  (
                    <div
                      style={{ cursor: 'pointer', display: 'inline-block', color: '#0d61bf' }}
                      onClick={() => onUsernameClick(competitor)}
                    >
                      {`${addSufix(tcoChallengeCnt)}`}
                    </div>
                  ) : `${addSufix(tcoChallengeCnt)}`
              ) : (
                tcoChallengeCnt
              )
            }
          </td>
          <td styleName={`${stylesName}.col-points`}>{formatPoints(tcoPoints)}</td>
          {
            isTopGear ? (
              <td styleName={`${stylesName}.col-points`}>{competitor.wins}</td>
            ) : null
          }
          {
            isTopGear ? (
              <td styleName={`${stylesName}.col-points`}>{competitor.total_earnings}</td>
            ) : null
          }
          {
            isAlgo ? (
              <td styleName={`${stylesName}.col-points`}>{tcoPoints}</td>
            ) : null
          }
        </tr>
      );
    })
  );

  return competitors.length ? (
    <table styleName={`${stylesName}.LeaderboardTable`}>
      <thead>
        <tr styleName={`${stylesName}.table-header`}>
          <th styleName={`${stylesName}.col-rank`}>Rank</th>
          <th styleName={`${stylesName}.col-handleHeader`} colSpan="2">Handle</th>
          {
            isCopilot ? (
              <th styleName={`${stylesName}.col-fulfillment`}>Fulfillment</th>
            ) : null
          }
          {
            isAlgo ? (
              <th styleName={`${stylesName}.col-challenges`}># of Matches</th>
            ) : (
              <th styleName={`${stylesName}.col-challenges`}># of Challenges</th>
            )
          }
          <th styleName={`${stylesName}.col-points`}>Points</th>
          {
            isTopGear ? (
              <th styleName={`${stylesName}.col-points`}>Wins</th>
            ) : null
          }
          {
            isTopGear ? (
              <th styleName={`${stylesName}.col-points`}>Total Earnings</th>
            ) : null
          }
          {
            isAlgo ? (
              <th styleName={`${stylesName}.col-points`}>Total Score</th>
            ) : null
          }
        </tr>
      </thead>
      <tbody>
        {renderTableRows(competitors)}
      </tbody>
    </table>
  ) : (
    <h2 style={{ textAlign: 'center' }}>No Data Available</h2>
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
  fulfillment: PT.number,
});

LeaderboardTable.propTypes = {
  competitors: PT.arrayOf(CompetitorShape).isRequired,
  isCopilot: PT.bool,
  onUsernameClick: PT.func,
  isTopGear: PT.bool,
  isAlgo: PT.bool,
  themeName: PT.string,
};

LeaderboardTable.defaultProps = {
  isCopilot: false,
  onUsernameClick: null,
  isTopGear: false,
  isAlgo: false,
  themeName: 'Default',
};
