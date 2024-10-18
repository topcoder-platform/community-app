import React from 'react';
import PT from 'prop-types';

import { config } from 'topcoder-react-utils';

import './style.scss';

export default function TrackIcon({
  track,
  type,
  tcoEligible,
  MAIN_URL,
  challengesUrl,
}) {
  const TCO_URL = `${MAIN_URL}/tco`;
  const trackStyle = track.replace(' ', '-').toLowerCase();
  let abbreviationStyle = type.abbreviation;
  if (['CH', 'F2F', 'TSK', 'MM'].indexOf(abbreviationStyle) < 0) {
    abbreviationStyle = '';
  }
  return (
    <span styleName={`trackIcon ${tcoEligible ? 'haveTco' : ''}`}>
      {challengesUrl ? (
        <a
          href={`${challengesUrl}?filter[types][0]=${encodeURIComponent(
            type.id,
          )}`}
          styleName={`${trackStyle} main-icon`}
        >
          {type.abbreviation}
        </a>
      ) : (
        <div styleName={`${abbreviationStyle} main-icon`}>
          {type.abbreviation}
        </div>
      )}
      <a href={`${TCO_URL}`}>
        <div
          styleName={`${abbreviationStyle} tco-icon ${
            tcoEligible ? '' : 'hidden'
          }`}
        >
          TCO
        </div>
      </a>
    </span>
  );
}

TrackIcon.defaultProps = {
  MAIN_URL: config.URL.BASE,
  tcoEligible: '',
  challengesUrl: '',
  track: 'Development',
};

TrackIcon.propTypes = {
  tcoEligible: PT.string,
  track: PT.string,
  type: PT.shape().isRequired,
  MAIN_URL: PT.string,
  challengesUrl: PT.string,
};
