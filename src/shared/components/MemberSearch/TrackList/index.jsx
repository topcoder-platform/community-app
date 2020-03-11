import React from 'react';
import PropTypes from 'prop-types';
import shortId from 'shortid';
import TrackItem from './TrackItem';

import './style.scss';

const TrackList = ({ tracks }) => {
  let trackItems;
  if (tracks.length) {
    trackItems = tracks.map(t => <TrackItem key={shortId()} track={t} />);
  } else {
    trackItems = <TrackItem track="" />;
  }

  return (
    <div styleName="track-list">
      {trackItems}
    </div>
  );
};

TrackList.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TrackList;
