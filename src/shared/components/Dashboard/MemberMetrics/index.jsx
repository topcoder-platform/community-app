import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import Switch from 'components/SwitchWithLabel';

import Earnings from './Earnings';
import Records from './Records';

import style from './style.scss';

export default function Finances({
  finances,
  financesLoading,
  showEarnings,
  stats,
  statsLoading,
  switchShowEarnings,
}) {
  return (
    <div styleName="container">
      <h1 styleName="title">My Earnings and Records</h1>
      {
        financesLoading || statsLoading ? (
          <div styleName="loading">
            <LoadingIndicator />
          </div>
        ) : (
          <div>
            <Earnings
              finances={finances}
              showEarnings={showEarnings}
            />
            <Records stats={stats} />
          </div>
        )
      }
      <Switch
        enabled={showEarnings}
        onSwitch={switchShowEarnings}
        labelBefore="Show Earnings"
        theme={{ wrapper: style.showEarningsSwitch }}
      />
    </div>
  );
}

Finances.propTypes = {
  finances: PT.arrayOf(PT.object).isRequired,
  financesLoading: PT.bool.isRequired,
  showEarnings: PT.bool.isRequired,
  stats: PT.shape().isRequired,
  statsLoading: PT.bool.isRequired,
  switchShowEarnings: PT.func.isRequired,
};
