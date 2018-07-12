/**
 * Competition Types & Leaderboard Component
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import ContentfulLoader from 'containers/ContentfulLoader';

import CompetitionTypes from './CompetitionTypes';
// import Leaderboard from './Leaderboard';

import './styles.scss';

const CompetitionLeaderboard = ({ data, track }) => {
  const result = data;
  const competitionTypesIds = _.map(data.competitionTypes.tracks, item => (item.sys.id
  ));
  const leaderboardIds = data.tcoLeaderboard
    ? _.map(data.tcoLeaderboard.stages, item => (item.sys.id)) : [];
  const entryIds = competitionTypesIds.concat(leaderboardIds);
  return (
    <ContentfulLoader
      entryIds={entryIds}
      render={(items) => {
        const tracks = _.filter(
          items.entries.items,
          item => competitionTypesIds.includes(item.sys.id),
        );
        const stages = _.filter(items.entries.items, item => leaderboardIds.includes(item.sys.id));
        result.competitionTypes.tracks = tracks;
        if (data.tcoLeaderboard) {
          result.tcoLeaderboard.stages = stages;
        }
        return (
          <div styleName="container">
            <div styleName="competition">
              <CompetitionTypes track={track} data={result.competitionTypes} />
            </div>
            {/*
              <div styleName="leaderboard">
                <Leaderboard data={result.tcoLeaderboard} />
              </div>
            */}
          </div>
        );
      }}
    />
  );
};

CompetitionLeaderboard.propTypes = {
  data: PT.shape().isRequired,
  track: PT.string.isRequired,
};

export default CompetitionLeaderboard;
