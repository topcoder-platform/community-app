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

import React from 'react';
import PT from 'prop-types';
import { Avatar } from 'topcoder-react-ui-kit';
import { config } from 'topcoder-react-utils';

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
  1: '1',
  2: '2',
  3: '3',
};

export default function PodiumSpot(props) {
  const {
    competitor,
  } = props;

  let photoUrl = competitor.avatar;
  if (photoUrl) {
    photoUrl = `${config.CDN.PUBLIC}/avatar/${
      encodeURIComponent(photoUrl)}?size=160`;
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
        <div styleName="styles.ranking">{DISPLAY_RANKING[competitor.rank]}</div>
      </span>
      <div>
        <a styleName="styles.profile-link" href={`${config.URL.BASE}/members/${competitor.handle}/`}>
          {competitor.handle}
        </a>
      </div>
      <div styleName="styles.winnings-info">
        {
          competitor.fulfillment ? (
            <div styleName="styles.stats">
              <span styleName="styles.value">{competitor.fulfillment}</span>
              <span>fulfillment</span>
            </div>
          ) : null
        }
        <div styleName="styles.stats">
          <span styleName="styles.value">{competitor.challengecount}</span>
          <span>challenges</span>
        </div>
        <div styleName="styles.stats">
          <span styleName="styles.value">{competitor.points}</span>
          <span>points</span>
        </div>
      </div>
    </div>
  );
}

const CompetitorShape = PT.shape({
  rank: PT.number.isRequired,
  avatar: PT.string,
  handle: PT.string.isRequired,
  challengecount: PT.number.isRequired,
  points: PT.number.isRequired,
});

PodiumSpot.propTypes = {
  competitor: CompetitorShape.isRequired,
};
