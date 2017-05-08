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
import { goldAvatarStyles, silverAvatarStyles, bronzeAvatarStyles } from '../avatarStyles';

import './styles.scss';

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
  1: goldAvatarStyles,
  2: silverAvatarStyles,
  3: bronzeAvatarStyles,
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

  return (
    <div styleName={`PodiumSpot PodiumSpot--${PODIUM_ITEM_MODIFIER[competitor.rank]}`}>
      <span styleName="leaderboard-avatar">
        <Avatar url={competitor.avatarUrl} customStyles={CUSTOM_STYLES[competitor.rank]} />
      </span>
      <div styleName="ranking">{DISPLAY_RANKING[competitor.rank]}</div>
      <div>
        <a styleName="profile-link" href={`${config.URL.BASE}/members/${competitor['user.handle']}/`}>
          {competitor['user.handle']}
        </a>
      </div>
      <div styleName="winnings-info">
        <span>{competitor['project_result.final_score']} points</span>
        <span>{competitor.wins} challenges</span>
      </div>
    </div>
  );
}

const CompetitorShape = PT.shape({
  rank: PT.number.isRequired,
  avatarUrl: PT.string,
  'user.handle': PT.string.isRequired,
  wins: PT.number.isRequired,
  'project_result.final_score': PT.number.isRequired,
});

PodiumSpot.propTypes = {
  competitor: CompetitorShape.isRequired,
};
