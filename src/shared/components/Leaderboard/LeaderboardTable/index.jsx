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

import React from 'react';
import PT from 'prop-types';
import { Avatar } from 'topcoder-react-ui-kit';
import { config } from 'topcoder-react-utils';

import avatarStyles from '../avatarStyles.scss';
import styles from './styles.scss'; // eslint-disable-line

export default function LeaderboardTable(props) {
  const {
    competitors,
    isCopilot,
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
            <a href={`${config.URL.BASE}/members/${competitor.handle}/`}>{competitor.handle}</a>
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
          <th styleName="styles.col-handle" colSpan="2">Handle</th>
          {
            isCopilot ? (
              <th styleName="styles.col-fulfillment">Fulfillment</th>
            ) : null
          }
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
  avatar: PT.string,
  handle: PT.string.isRequired,
  challengecount: PT.number.isRequired,
  points: PT.number.isRequired,
  fulfillment: PT.number,
});

LeaderboardTable.propTypes = {
  competitors: PT.arrayOf(CompetitorShape).isRequired,
  isCopilot: PT.bool,
};

LeaderboardTable.defaultProps = {
  isCopilot: false,
};
