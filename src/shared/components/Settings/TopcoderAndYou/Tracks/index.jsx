/**
 * Tracks
 * Topcoder & You Settings Page
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import tracks from './tracks';
import Track from './Track';

import '../styles.scss';

const Tracks = (props) => {
  const {
    newProfileInfo,
    onChange,
  } = props;

  return (
    <div styleName="you-and-topcoder-container">
      <div styleName="track-list">
        {
          _.map(tracks, (track) => {
            const result = newProfileInfo.tracks.filter(item => (
              item.toUpperCase() === track.id.toUpperCase()
            ));
            const checked = result.length !== 0;
            return (
              <Track
                icon={track.icon}
                key={track.id}
                id={track.id}
                value={track.id}
                checked={checked}
                title={track.name}
                description={track.description}
                onToggle={event => onChange(track.id, event.target.checked)}
              />
            );
          })
        }
      </div>
    </div>
  );
};

Tracks.defaultProps = {
  newProfileInfo: {},
};

Tracks.propTypes = {
  newProfileInfo: PT.shape(),
  onChange: PT.func.isRequired,
};

export default Tracks;
