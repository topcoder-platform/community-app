import React from 'react';
import PT from 'prop-types';

import { config } from 'topcoder-react-utils';

import Abbreviation from './Abbreviation';
import './style.scss';

export default function TrackIcon({
  track,
  subTrack,
  tcoEligible,
  isDataScience,
  MAIN_URL,
}) {
  const TCO_URL = `${MAIN_URL}/tco`;
  return (
    <span styleName="trackIcon">
      <div styleName={`${(isDataScience ? 'data_science' : track.toLowerCase())} main-icon`}>{Abbreviation[track][subTrack]}</div>
      <a href={`${TCO_URL}`}>
        <div styleName={tcoEligible ? `${(isDataScience ? 'data_science' : track.toLowerCase())} tco-icon` : 'hidden'}>TCO</div>
      </a>
    </span>
  );
}

TrackIcon.defaultProps = {
  isDataScience: false,
  MAIN_URL: config.URL.BASE,
  tcoEligible: '',
};

TrackIcon.propTypes = {
  isDataScience: PT.bool,
  tcoEligible: PT.string,
  track: PT.string.isRequired,
  subTrack: PT.string.isRequired,
  MAIN_URL: PT.string,
};
