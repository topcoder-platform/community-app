/**
 * Track Component.  Renders the track, winner and list of
 * finalists for the given track of an event.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';

import defaultStyles from './styles.scss';

const Track = ({
  count, data, track, theme,
}) => (data ? (
  <div className={theme.container}>
    <div className={theme.track}>{track}</div>
    <div className={theme.winner}>
      <img src={data.portrait} alt="Winner Portrait" />
      <div>{data.winner}</div>
      <div className={theme.label}>Champion</div>
    </div>
    {
      data.finalists.map(handle => (
        <div key={handle} className={theme.finalist}>{handle}</div>
      ))
    }
    { _.range(data.finalists.length, count).map(i => <div className={theme.empty} key={i} />) }
  </div>
) : false);

Track.defaultProps = {
  count: 10,
  track: 'TRACK',
};

Track.propTypes = {
  count: PT.number,
  data: PT.shape().isRequired,
  track: PT.string,
  theme: PT.shape().isRequired,
};

export default themr('hall-of-fame/tco-track', defaultStyles)(Track);
