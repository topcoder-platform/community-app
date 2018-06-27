/**
 * Track Component.  Renders the track, champion and their number of wins.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';

import defaultStyles from './styles.scss';

const Track = ({
  count, data, track, theme, icon,
}) => (data ? (
  <div className={theme.container}>
    <div className={theme.track}>
      <span>
        {track}
      </span>
      <img src={icon} alt="Champion Icon" />
    </div>
    {
      data.members.map(member => (
        <div key={member.handle} className={theme.champion}>
          <span>
            {member.handle}
          </span>
          <strong>
            {member.value}
          </strong>
        </div>
      ))
    }
    { _.range(data.members.length, count).map(i => <div className={theme.empty} key={i} />) }
  </div>
) : <div />);

Track.defaultProps = {
  count: 10,
  track: 'TRACK',
};

Track.propTypes = {
  count: PT.number,
  data: PT.shape().isRequired,
  track: PT.string,
  theme: PT.shape().isRequired,
  icon: PT.string.isRequired,
};

export default themr('hall-of-fame/tco-champion-track', defaultStyles)(Track);
