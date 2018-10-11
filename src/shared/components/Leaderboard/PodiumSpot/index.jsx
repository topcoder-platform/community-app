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

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
export default function PodiumSpot(props) {
  const {
    competitor,
    isCopilot,
    onUsernameClick,
  } = props;

  let photoUrl = competitor.avatar;
  if (photoUrl) {
    photoUrl = `${config.CDN.PUBLIC}/avatar/${
      encodeURIComponent(photoUrl)}?size=160`;
  }
  let rootStyle = 'styles.PodiumSpot';
  if (PODIUM_ITEM_MODIFIER[competitor.rank]) rootStyle += ` styles.PodiumSpot--${PODIUM_ITEM_MODIFIER[competitor.rank]}`;

  return (
    <div styleName={rootStyle}>
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
        {
          onUsernameClick ? (
            <div
              styleName="styles.handle-link"
              onClick={() => onUsernameClick(competitor)}
            >
              {competitor.handle}
            </div>
          ) : (
            <a styleName="styles.profile-link" href={`${config.URL.BASE}/members/${competitor.handle}/`}>
              {competitor.handle}
            </a>
          )
        }
      </div>
      <div styleName="styles.winnings-info">
        {
          isCopilot ? (
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
};

PodiumSpot.defaultProps = {
  isCopilot: false,
  onUsernameClick: null,
};
