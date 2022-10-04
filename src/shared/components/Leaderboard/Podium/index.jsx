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
 *   - isCopilot: Copilot leaderboards have special fields. This flag controlls
 *     if those should be displayed
 *   - onUsernameClick: Function if provided it is invoked with the clicked competitor
 *     instead of linking to member's profile
 *   - isTopGear: Topgear leaderboards have special fileds
 */

import React from 'react';
import PT from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import PodiumSpot from '../PodiumSpot';

import defaultStyles from './themes/default.scss'; // eslint-disable-line
import tco23Styles from './themes/tco23.scss'; // eslint-disable-line

const THEME = {
  Default: 'defaultStyles',
  TCO23: 'tco23Styles',
};

export default function Podium(props) {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const {
    competitors,
    isCopilot,
    onUsernameClick,
    isTopGear,
    isAlgo,
    themeName,
  } = props;

  const stylesName = THEME[themeName] || THEME.Default;
  const renderComps = competitors;
  if (!isMobile && renderComps.length === 3) {
    [renderComps[0], renderComps[1]] = [renderComps[1], renderComps[0]];
  }
  const renderPodium = (comps) => {
    const podiumSpots = comps.map(comp => (
      <div key={comp.rank} styleName={`${stylesName}.podium-column`}>
        <PodiumSpot
          competitor={comp}
          isCopilot={isCopilot}
          onUsernameClick={onUsernameClick}
          isTopGear={isTopGear}
          isAlgo={isAlgo}
          themeName={themeName}
        />
      </div>
    ));

    return (
      <div styleName={`${stylesName}.${themeName === 'TCO23' ? 'PodiumWrapCondense' : 'PodiumWrap'}`} style={comps.length === 4 ? { 'justify-content': 'space-between' } : {}}>
        {podiumSpots}
      </div>
    );
  };

  return (
    <div styleName={`${stylesName}.Podium`}>
      {renderPodium(renderComps)}
    </div>
  );
}

const CompetitorShape = PT.shape({});

Podium.propTypes = {
  competitors: PT.arrayOf(CompetitorShape).isRequired,
  isCopilot: PT.bool,
  onUsernameClick: PT.func,
  isTopGear: PT.bool,
  isAlgo: PT.bool,
  themeName: PT.string.isRequired,
};

Podium.defaultProps = {
  isCopilot: false,
  onUsernameClick: null,
  isTopGear: false,
  isAlgo: false,
};
