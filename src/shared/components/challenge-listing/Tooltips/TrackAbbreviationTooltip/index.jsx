/**
 * Track Abbreviation Tooltip Component.
 *
 * USAGE:
 * Wrap with <TrackAbbreviationTooltip></TrackAbbreviationTooltip> tags the element(s)
 * which should show the tooltip when hovered. Pass in 'track' and 'subTrack' props.
 */

import React from 'react';
import PT from 'prop-types';
import Tooltip from 'components/Tooltip';
import './style.scss';

/**
 * Renders the tooltip's content.
 */
function Tip({
  track,
  type,
}) {
  const trackStyle = track.replace(' ', '-').toLowerCase();
  return (
    <div styleName="track-abbreviation-tooltip">
      <div styleName={`header ${trackStyle}`}>
        {type.name}
      </div>
      <div styleName="body">
        {type.description}
      </div>
    </div>
  );
}

Tip.defaultProps = {
  track: 'Development',
};

Tip.propTypes = {
  track: PT.string,
  type: PT.shape().isRequired,
};

function placeArrow(TooltipNode) {
  const arrow = TooltipNode.querySelector('.rc-tooltip-arrow');
  arrow.style.left = '15px';
}

/**
 * Renders the tooltip.
 */
function TrackAbbreviationTooltip({
  children,
  track,
  type,
}) {
  const tip = <Tip track={track} type={type} />;
  return (
    <Tooltip
      className="track-abbreviation-tooltip"
      content={tip}
      position="topLeft"
      placeArrow={placeArrow}
    >
      {children}
    </Tooltip>
  );
}

TrackAbbreviationTooltip.defaultProps = {
  track: 'Development',
};

TrackAbbreviationTooltip.propTypes = {
  children: PT.node.isRequired,
  track: PT.string,
  type: PT.shape().isRequired,
};

export default TrackAbbreviationTooltip;
