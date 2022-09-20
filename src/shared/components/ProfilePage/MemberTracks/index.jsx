import React from 'react';
import PT from 'prop-types';
import { indexOf } from 'lodash';

import './styles.scss';
import TrackItem from './TrackItem';

export const trackMap = {
  DEVELOP: 'Developer',
  DESIGN: 'Designer',
  DATA_SCIENCE: 'Data Scientist',
};

const MemberTracks = ({
  copilot,
  info,
  hasMM,
}) => {
  const { tracks } = info;

  return (
    <div>
      {
          tracks && tracks.length > 0
          && (
          <div styleName="member-tracks">
              {
                [...info.tracks, ...(indexOf(info.tracks, 'DATA_SCIENCE') === -1 && hasMM ? ['DATA_SCIENCE'] : []), ...(copilot ? ['COPILOT'] : [])].map((track, index) => (
                  <TrackItem key={index} trackName={trackMap[track] || ''} /> /* eslint-disable-line react/no-array-index-key */
                ))
              }
          </div>
          )
        }
    </div>
  );
};


MemberTracks.defaultProps = {
  copilot: false,
  hasMM: false,
  info: {},
};

MemberTracks.propTypes = {
  copilot: PT.bool,
  hasMM: PT.bool,
  info: PT.shape(),
};

export default MemberTracks;
