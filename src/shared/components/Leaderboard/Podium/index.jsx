/**
 * Leaderboard Podium
 *
 * Description:
 *   Component that display the top spots on a leaderboard
 *   It is designed to work with the PodiumSpot component. The Podium component
 *   simply created a layout to display PodiumSpots.
 *
 * Usage:
 *   <Podium competitors={competitors} />
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
import LoadingIndicator from 'components/LoadingIndicator';
import PodiumSpot from '../PodiumSpot';

import './styles.scss';

export default function Podium(props) {
  const {
    competitors,
  } = props;

  const renderPodium = (comps) => {
    if (comps.length === 0) {
      return (
        <LoadingIndicator />
      );
    }

    return (
      <div>
        <div styleName="podium-column">
          <PodiumSpot competitor={comps[1]} />
        </div>
        <div styleName="podium-column">
          <PodiumSpot competitor={comps[0]} />
        </div>
        <div styleName="podium-column">
          <PodiumSpot competitor={comps[2]} />
        </div>
      </div>
    );
  };

  return (
    <div styleName="Podium">
      {renderPodium(competitors)}
    </div>
  );
}

const CompetitorShape = PT.shape({
  rank: PT.number.isRequired,
  photourl: PT.string,
  'user.handle': PT.string.isRequired,
  'challenge.count': PT.number.isRequired,
  'project_result.final_score': PT.number.isRequired,
});

Podium.propTypes = {
  competitors: PT.arrayOf(CompetitorShape).isRequired,
};
