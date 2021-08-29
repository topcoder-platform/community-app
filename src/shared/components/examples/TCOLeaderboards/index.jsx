import React from 'react';
import TCOLeaderboardsContainer from 'containers/Dashboard/TCOLeaderboards';
import trackConfig from 'assets/mock-data/leaderboards-config-tco-2021.json';
import './style.scss';

export default function TCOLeaderboardsExample() {
  return (
    <div styleName="container">
      <div styleName="header">
        <h1>
          TCO Leaderboards Preview
        </h1>
      </div>
      <TCOLeaderboardsContainer
        trackConfig={trackConfig}
        itemCount={5}
      />
    </div>
  );
}
