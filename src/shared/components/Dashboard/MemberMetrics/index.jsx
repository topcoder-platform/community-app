import config from 'utils/config';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';

import { Link } from 'topcoder-react-utils';

// import Coin from './Coin';

import Earnings from './Earnings';
import Records from './Records';

import './style.scss';

export default function Finances({
  finances,
  financesLoading,
  stats,
  statsLoading,
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
            <Earnings finances={finances} />
            <Records stats={stats} />
          </div>
        )
      }
    </div>
  );
}

Finances.propTypes = {
  finances: PT.arrayOf(PT.object).isRequired,
  financesLoading: PT.bool.isRequired,
  stats: PT.shape().isRequired,
  statsLoading: PT.bool.isRequired,
};
