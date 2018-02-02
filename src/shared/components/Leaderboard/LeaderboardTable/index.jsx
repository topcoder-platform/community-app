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
 */

import config from 'utils/config';
import React from 'react';
import PT from 'prop-types';
import { Avatar } from 'topcoder-react-ui-kit';

import avatarStyles from '../avatarStyles.scss';
import styles from './styles.scss'; // eslint-disable-line

export default function LeaderboardTable(props) {
  const {
    competitors,
  } = props;
  const renderTableRows = comps => (
    comps.map((competitor) => {
      let photoUrl = competitor['challenge_stats.photo_url'];
      if (photoUrl && (photoUrl[0] === '/')) {
        photoUrl = config.URL.BASE + photoUrl;
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
            <a href={`${config.URL.BASE}/members/${competitor['challenge_stats.winner_handle']}/`}>{competitor['challenge_stats.winner_handle']}</a>
            <div styleName="styles.winnings-info">
              <span>{competitor.points} points</span>
              <span>{competitor['challenge_stats.count']} challenges</span>
            </div>
          </td>
          <td styleName="styles.col-challenges">{competitor['challenge_stats.count']}</td>
          <td styleName="styles.col-points">{competitor.points}</td>
        </tr>
      );
    })
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
  'challenge_stats.photo_url': PT.string,
  'challenge_stats.winner_handle': PT.string.isRequired,
  'challenge_stats.count': PT.number.isRequired,
  points: PT.number.isRequired,
});

LeaderboardTable.propTypes = {
  competitors: PT.arrayOf(CompetitorShape).isRequired,
};
