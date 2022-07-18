import React from 'react';
import PT from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import './styles.scss';

const TrackItem = ({ trackName }) => (
  <div styleName="track-item" key={uuidv4()}>
    <span>{trackName}</span>
  </div>
);


TrackItem.propTypes = {
  trackName: PT.string.isRequired,
};

export default TrackItem;
