/**
 * Competition Types & Leaderboard Component
 */

import React from 'react';
import PT from 'prop-types';

import CompetitionTypes from './CompetitionTypes';
import Leaderboard from './Leaderboard';

import './styles.scss';

const CompetitionLeaderboard = ({ data, track }) => (
  <div styleName="container">
    <div styleName="competition">
      <CompetitionTypes track={track} data={data.competitionTypes} />
    </div>
    <div styleName="leaderboard">
      <Leaderboard data={data.tcoLeaderboard} />
    </div>
  </div>
);

CompetitionLeaderboard.propTypes = {
  data: PT.shape().isRequired,
  track: PT.string.isRequired,
};

export default CompetitionLeaderboard;
