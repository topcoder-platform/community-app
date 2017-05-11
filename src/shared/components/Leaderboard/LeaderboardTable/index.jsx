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
 *      - avatarUrl: String. URL for the user's profile picture
 *        This will default to the default user avatar is undefined
 *      - user.handle: String, required. User handle
 *      - wins: Number, required. The number of challenge the user won
 *      - project_result.final_score: Number, required. The user's current score
 */

import config from 'utils/config';
import React from 'react';
import PT from 'prop-types';
import Avatar from 'components/Avatar';

import avatarStyles from '../avatarStyles.scss';
import styles from './styles.scss'; // eslint-disable-line

export default function LeaderboardTable(props) {
  const {
    competitors,
  } = props;

  const renderTableRows = comps => (
    comps.map(competitor => (
      <tr key={competitor.rank}>
        <td styleName="styles.col-rank">{competitor.rank}</td>
        <td styleName="styles.col-avatar">
          <span styleName="styles.leaderboard-avatar">
            <Avatar
              theme={{
                avatar: avatarStyles.default,
              }}
              url={competitor.avatarUrl}
            />
          </span>
        </td>
        <td styleName="styles.col-handle">
          <a href={`${config.URL.BASE}/members/${competitor['user.handle']}/`}>{competitor['user.handle']}</a>
          <div styleName="styles.winnings-info">
            <span>{competitor['project_result.final_score']} points</span>
            <span>{competitor.wins} challenges</span>
          </div>
        </td>
        <td styleName="styles.col-challenges">{competitor.wins}</td>
        <td styleName="styles.col-points">{competitor['project_result.final_score']}</td>
      </tr>
    ))
  );

  return (
    <table styleName="styles.LeaderboardTable">
      <thead>
        <tr>
          <th styleName="styles.col-rank">Rank</th>
          <th>&nbsp;</th>
          <th styleName="styles.col-handle">Handle</th>
          <th styleName="styles.col-challenges"># of Challenges</th>
          <th styleName="styles.col-points">Points</th>
        </tr>
      </thead>
      <tbody>
        {renderTableRows(competitors)}
      </tbody>
    </table>
  );
}

const CompetitorShape = PT.shape({
  rank: PT.number.isRequired,
  avatarUrl: PT.string,
  'user.handle': PT.string.isRequired,
  wins: PT.number.isRequired,
  'project_result.final_score': PT.number.isRequired,
});

LeaderboardTable.propTypes = {
  competitors: PT.arrayOf(CompetitorShape).isRequired,
};
