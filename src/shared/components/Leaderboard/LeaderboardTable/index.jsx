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
import styles from './styles.scss'; // eslint-disable-line

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
  } = props;
  const renderTableRows = comps => (
    comps.map((competitor) => {
      let photoUrl = competitor.avatar;
      if (photoUrl) {
        photoUrl = `${config.CDN.PUBLIC}/avatar/${
          encodeURIComponent(photoUrl)}?size=40`;
      }
      return (
        <tr key={competitor.rank}>
          <td styleName="styles.col-rank">{competitor.rank}</td>
          <td styleName="styles.col-avatar">
            <span styleName="styles.leaderboard-avatar">
              <Avatar
                theme={{
                  avatar: avatarStyles.default,
                }}
                url={photoUrl}
              />
            </span>
          </td>
          <td styleName="styles.col-handle">
            {
              onUsernameClick ? (
                <div
                  styleName="styles.handle-link"
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
            <div styleName="styles.winnings-info">
              {competitor.fulfillment && (<span>{competitor.fulfillment} fulfillment</span>)}
              <span>{competitor.points} points</span>
              <span>{competitor.challengecount} challenges</span>
            </div>
          </td>
          {
            isCopilot ? (
              <td styleName="styles.col-fulfillment">{competitor.fulfillment}</td>
            ) : null
          }
          <td styleName="styles.col-challenges">{competitor.challengecount}</td>
          <td styleName="styles.col-points">{formatPoints(competitor.points)}</td>
          {
            isTopGear ? (
              <td styleName="styles.col-points">{competitor.wins}</td>
            ) : null
          }
          {
            isTopGear ? (
              <td styleName="styles.col-points">{competitor.total_earnings}</td>
            ) : null
          }
          {
            isAlgo ? (
              <td styleName="styles.col-points">{competitor['srm_tco19.score']}</td>
            ) : null
          }
        </tr>
      );
    })
  );

  return (
    <table styleName="styles.LeaderboardTable">
      <thead>
        <tr>
          <th styleName="styles.col-rank">Rank</th>
          <th>Handle</th>
          <th styleName="styles.col-handle" />
          {
            isCopilot ? (
              <th styleName="styles.col-fulfillment">Fulfillment</th>
            ) : null
          }
          <th styleName="styles.col-challenges"># of Challenges</th>
          <th styleName="styles.col-points">Points</th>
          {
            isTopGear ? (
              <th styleName="styles.col-points">Wins</th>
            ) : null
          }
          {
            isTopGear ? (
              <th styleName="styles.col-points">Total Earnings</th>
            ) : null
          }
          {
            isAlgo ? (
              <th styleName="styles.col-points">Total Score</th>
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
};

LeaderboardTable.defaultProps = {
  isCopilot: false,
  onUsernameClick: null,
  isTopGear: false,
  isAlgo: false,
};
