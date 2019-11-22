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

import avatarStyles from '../avatarStyles.scss';
import defaultStyles from './themes/styles.scss'; // eslint-disable-line
import tco20Styles from './themes/tco20.scss'; // eslint-disable-line

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
  const renderTableRows = comps => (
    comps.map((competitor) => {
      let photoUrl = competitor.avatar;
      if (photoUrl) {
        photoUrl = `${config.CDN.PUBLIC}/avatar/${
          encodeURIComponent(photoUrl)}?size=40`;
      }
      return (
        <tr key={competitor.rank}>
          <td styleName={`${stylesName}.col-rank`}>{competitor.rank}</td>
          <td styleName={`${stylesName}.col-avatar`}>
            <span styleName={`${stylesName}.leaderboard-avatar`}>
              <Avatar
                theme={{
                  avatar: avatarStyles.default,
                }}
                url={photoUrl}
              />
            </span>
          </td>
          <td styleName={`${stylesName}.col-handle`}>
            {
              onUsernameClick ? (
                <div
                  styleName={`${stylesName}.handle-link`}
                  onClick={() => onUsernameClick(competitor)}
                >
                  {competitor.handle}
                </div>
              ) : (
                <a href={`${config.URL.BASE}/members/${competitor.handle}/`}>
                  {competitor.handle}
                </a>
              )
            }
            <div styleName={`${stylesName}.winnings-info`}>
              {competitor.fulfillment && (<span>{competitor.fulfillment} fulfillment</span>)}
              <span>{competitor.points} points</span>
              <span>{competitor.challengecount} challenges</span>
            </div>
          </td>
          {
            isCopilot ? (
              <td styleName={`${stylesName}.col-fulfillment`}>{competitor.fulfillment}</td>
            ) : null
          }
          <td styleName={`${stylesName}.col-challenges`}>{competitor.challengecount}</td>
          <td styleName={`${stylesName}.col-points`}>{formatPoints(competitor.points)}</td>
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
              <td styleName={`${stylesName}.col-points`}>{competitor['srm_tco19.score']}</td>
            ) : null
          }
        </tr>
      );
    })
  );

  return (
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
          <th styleName={`${stylesName}.col-challenges`}># of Challenges</th>
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
