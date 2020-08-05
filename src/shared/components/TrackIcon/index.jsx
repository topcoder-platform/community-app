import React from 'react';
import PT from 'prop-types';

import { config } from 'topcoder-react-utils';

import './style.scss';

export default function TrackIcon({
  track,
  subTrack,
  type,
  tcoEligible,
  isDataScience,
  MAIN_URL,
  challengesUrl,
}) {
  const TCO_URL = `${MAIN_URL}/tco`;
  return (
    <span styleName="trackIcon">
      {challengesUrl ? (
        <a
          href={`${challengesUrl}?filter[subtracks][0]=${
            encodeURIComponent(subTrack)}`}
          styleName={`${(isDataScience ? 'data_science' : track.toLowerCase())} main-icon`}
        >
          {type}
        </a>
      ) : (
        <div
          styleName={`${(isDataScience ? 'data_science' : track.toLowerCase())} main-icon`}
        >
          {type}
        </div>
      )}
      <a href={`${TCO_URL}`}>
        <div styleName={tcoEligible ? `${(isDataScience ? 'data_science' : track.toLowerCase())} tco-icon` : 'hidden'}>
          TCO
        </div>
      </a>
    </span>
  );
}

TrackIcon.defaultProps = {
  isDataScience: false,
  MAIN_URL: config.URL.BASE,
  tcoEligible: '',
  challengesUrl: '',
  track: 'DEVELOP',
  subTrack: 'DEVELOPMENT',
  type: 'CH',
};

TrackIcon.propTypes = {
  isDataScience: PT.bool,
  tcoEligible: PT.string,
  track: PT.string,
  subTrack: PT.string,
  type: PT.string,
  MAIN_URL: PT.string,
  challengesUrl: PT.string,
};
