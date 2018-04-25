/**
 * Track Component.  Renders the track, champion and their number of wins.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';

import championIcon from 'assets/images/tco-champion-icon.png';

import defaultStyles from './styles.scss';

const Track = ({
  count, data, track, theme,
}) => (data ? (
  <div className={theme.container}>
    <div className={theme.track}>
      <span>{track}</span>
      <img src={championIcon} alt="Champion Icon" />
    </div>
    {
      data.map(({ handle, wins }) => (
        <div key={handle} className={theme.champion}>
          <span>{handle}</span><strong>{wins}</strong>
        </div>
      ))
    }
    { _.range(data.length, count).map(i => <div className={theme.empty} key={i} />) }
  </div>
) : <div />);

Track.defaultProps = {
  count: 10,
  track: 'TRACK',
};

Track.propTypes = {
  count: PT.number,
  data: PT.arrayOf(PT.shape).isRequired,
  track: PT.string,
  theme: PT.shape().isRequired,
};

export default themr('hall-of-fame/tco-champion-track', defaultStyles)(Track);
