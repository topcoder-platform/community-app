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
 */

import config from 'utils/config';
import React from 'react';
import PT from 'prop-types';
import { Avatar } from 'topcoder-react-ui-kit';

import avatarStyles from '../avatarStyles.scss';
import styles from './styles.scss'; // eslint-disable-line

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
  1: avatarStyles.gold,
  2: avatarStyles.silver,
  3: avatarStyles.bronze,
};

/**
 * Object used to get the proper string to display based on user ranking.
 */
const DISPLAY_RANKING = {
  1: '1st',
  2: '2nd',
  3: '3rd',
};

export default function PodiumSpot(props) {
  const {
    competitor,
  } = props;

  let photoUrl = competitor['challenge_stats.photo_url'];
  if (photoUrl && (photoUrl[0] === '/')) {
    photoUrl = config.URL.BASE + photoUrl;
  }

  return (
    <div styleName={`styles.PodiumSpot styles.PodiumSpot--${PODIUM_ITEM_MODIFIER[competitor.rank]}`}>
      <span styleName="styles.leaderboard-avatar">
        <Avatar
          theme={{
            avatar: CUSTOM_STYLES[competitor.rank],
          }}
          url={photoUrl}
        />
      </span>
      <div styleName="styles.ranking">{DISPLAY_RANKING[competitor.rank]}</div>
      <div>
        <a styleName="styles.profile-link" href={`${config.URL.BASE}/members/${competitor['challenge_stats.winner_handle']}/`}>
          {competitor['challenge_stats.winner_handle']}
        </a>
      </div>
      <div styleName="styles.winnings-info">
        <span>{competitor.points} points</span>
        <span>{competitor['challenge_stats.count']} challenges</span>
      </div>
    </div>
  );
}

const CompetitorShape = PT.shape({
  rank: PT.number.isRequired,
  'challenge_stats.photo_url': PT.string,
  'challenge_stats.winner_handle': PT.string.isRequired,
  'challenge_stats.count': PT.number.isRequired,
  points: PT.number.isRequired,
});

PodiumSpot.propTypes = {
  competitor: CompetitorShape.isRequired,
};
