import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';

const TrackItem = ({ track }) => {
  const trackStyles = classNames(
    'track-item',
    { [`track-${track.toLowerCase()}`]: track.length },
    { 'no-track': !track.length },
  );

  const trackMap = {
    DEVELOP: 'Developer',
    DESIGN: 'Designer',
    DATA_SCIENCE: 'Data Scientist',
  };

  const trackName = trackMap[track];

  return (
    <span styleName={trackStyles}>
      <span styleName="track-name">{trackName || 'No track selected'}</span>
    </span>
  );
};

TrackItem.propTypes = {
  track: PropTypes.string.isRequired,
};

export default TrackItem;
