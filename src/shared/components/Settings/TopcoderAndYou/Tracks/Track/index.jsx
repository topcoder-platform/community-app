/**
 * Render Track Component
 */
import React from 'react';
import PT from 'prop-types';
import ReactSVG from 'react-svg';
import { isomorphy } from 'topcoder-react-utils';

import './styles.scss';

let assets;
if (isomorphy.isClientSide()) {
  assets = require.context('assets/images/profile/tracks', false, /svg/);
}

export default function Track({
  checked,
  id,
  onToggle,
  title,
  description,
  value,
}) {
  const icon = `./${id.toLowerCase()}.svg`;
  return (
    <div styleName="track-container">
      <div styleName="body">
        <div styleName="icon">
          { assets && assets.keys().includes(icon) ? <ReactSVG path={assets(`${icon}`)} /> : '' }
        </div>
        <div styleName="info">
          <div styleName="info-first-line">
            { title }
          </div>
          <div styleName="info-second-line">
            { description }
          </div>
        </div>
      </div>
      <div styleName="onoffswitch-no-padding-right">
        <input
          type="checkbox"
          name="eprf-onoffswitch"
          id={`pre-onoffswitch-${id}`}
          value={value}
          checked={checked}
          onChange={onToggle}
          className="onoffswitch-checkbox"
        />
        <label htmlFor={`pre-onoffswitch-${id}`} className="onoffswitch-label">
          <span className="onoffswitch-inner" />
          <span className="onoffswitch-switch" />
          <input type="hidden" />
        </label>
      </div>
    </div>
  );
}

Track.propTypes = {
  id: PT.string.isRequired,
  value: PT.string.isRequired,
  checked: PT.bool.isRequired,
  title: PT.string.isRequired,
  description: PT.string.isRequired,
  onToggle: PT.func.isRequired,
};
