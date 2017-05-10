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
import { defaultAvatarStyles } from '../avatarStyles';

import './styles.scss';

export default function LeaderboardTable(props) {
  const {
    competitors,
  } = props;

  const renderTableRows = comps => (
    comps.map(competitor => (
      <tr key={competitor.rank}>
        <td styleName="col-rank">{competitor.rank}</td>
        <td styleName="col-avatar">
          <span styleName="leaderboard-avatar">
            <Avatar url={competitor.avatarUrl} customStyles={defaultAvatarStyles} />
          </span>
        </td>
        <td styleName="col-handle">
          <a href={`${config.URL.BASE}/members/${competitor['user.handle']}/`}>{competitor['user.handle']}</a>
          <div styleName="winnings-info">
            <span>{competitor['project_result.final_score']} points</span>
            <span>{competitor.wins} challenges</span>
          </div>
        </td>
        <td styleName="col-challenges">{competitor.wins}</td>
        <td styleName="col-points">{competitor['project_result.final_score']}</td>
      </tr>
    ))
  );

  return (
    <table styleName="LeaderboardTable">
      <thead>
        <tr>
          <th styleName="col-rank">Rank</th>
          <th>&nbsp;</th>
          <th styleName="col-handle">Handle</th>
          <th styleName="col-challenges"># of Challenges</th>
          <th styleName="col-points">Points</th>
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
