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
import PodiumSpot from '../PodiumSpot';

import './styles.scss';

export default function Podium(props) {
  const {
    competitors,
  } = props;

  const renderPodium = (comps) => {
    let podiumSpots = comps.map(comp => (
      <div key={comp.rank} styleName="podium-column">
        <PodiumSpot competitor={comp} />
      </div>
    ));

    if (comps.length === 3) {
      podiumSpots = [
        ...podiumSpots.slice(0, 0),
        podiumSpots[1],
        ...podiumSpots.slice(1, 1),
        podiumSpots[0],
        ...podiumSpots.slice(2),
      ];
    }

    return (
      <div styleName="PodiumWrap">
        {podiumSpots}
      </div>
    );
  };

  return (
    <div styleName="Podium">
      {renderPodium(competitors)}
    </div>
  );
}

const CompetitorShape = PT.shape({});

Podium.propTypes = {
  competitors: PT.arrayOf(CompetitorShape).isRequired,
};
