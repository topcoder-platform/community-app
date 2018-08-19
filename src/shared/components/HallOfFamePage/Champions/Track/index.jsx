/**
 * Track Component.  Renders the track, champion and their number of wins.
 */
import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';

import defaultStyles from './styles.scss';

const Track = ({
  data, track, theme, icon,
}) => (data ? (
  <div className={theme.container}>
    <div className={theme.track}>
      <span>
        {track}
      </span>
      <img src={icon} alt="Champion Icon" />
    </div>
    {
      data.fields.members.map(member => (
        <div key={member.fields.handle} className={theme.champion}>
          <span>
            {member.fields.handle}
          </span>
          <strong>
            {member.fields.value}
          </strong>
        </div>
      ))
    }
    <div className={theme.filler} />
  </div>
) : <div />);

Track.defaultProps = {
  track: 'TRACK',
};

Track.propTypes = {
  data: PT.shape().isRequired,
  track: PT.string,
  theme: PT.shape().isRequired,
  icon: PT.string.isRequired,
};

export default themr('hall-of-fame/tco-champion-track', defaultStyles)(Track);
