/**
 * Track Icon Component
 */

import React from 'react';
import PT from 'prop-types';

import './style.scss';

export default function TrackIcon({
  track,
  abbreviation,
  isBigIcon,
  isActive,
  onClick,
}) {
  return (
    <div
      styleName="trackIcon"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={null}
    >
      <div styleName={`${track.toLowerCase()} ${isBigIcon ? 'big-icon' : `${isActive ? 'main-icon-active' : 'main-icon'}`} `}>
        {abbreviation}
      </div>
    </div>
  );
}

TrackIcon.defaultProps = {
  isBigIcon: true,
  isActive: false,
  onClick: null,
};

TrackIcon.propTypes = {
  isBigIcon: PT.bool,
  track: PT.string.isRequired,
  abbreviation: PT.string.isRequired,
  onClick: PT.func,
  isActive: PT.bool,
};
