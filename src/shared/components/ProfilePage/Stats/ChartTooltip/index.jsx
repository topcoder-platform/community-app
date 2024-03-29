/**
 * Chart tooltip.  Displays the stats of a TopCoder member.
 */
/* eslint-env browser */
import React from 'react';
import PT from 'prop-types';
import './styles.scss';
import cn from 'classnames';

const ChartTooltip = ({
  show, left, top, challengeName,
  challengeData, rating, rotated, ratingColor, href,
  id,
}) => (
  <a
    id={`chart-tooltip-${id}`}
    styleName={cn('chart-tooltip', rotated ? 'rotated' : null)}
    style={{
      display: show ? 'block' : 'none',
      left,
      top,
      pointerEvents: href ? 'all' : 'none',
    }}
    href={href}
  >
    <div styleName="tooltip-rating" style={{ backgroundColor: ratingColor }}>
      {rating}
    </div>
    <div styleName="tooltip-challenge">
      <div styleName="challenge-name">
        {challengeName}
      </div>
      <div styleName="challenge-date">
        {challengeData}
      </div>
    </div>
  </a>
);


ChartTooltip.defaultProps = {
  show: false,
  left: 0,
  top: 0,
  challengeName: '',
  challengeData: '',
  rating: 0,
  ratingColor: '',
  href: null,
  rotated: false,
  id: '',
};

ChartTooltip.propTypes = {
  show: PT.bool,
  left: PT.number,
  top: PT.number,
  challengeName: PT.string,
  challengeData: PT.string,
  rating: PT.number,
  ratingColor: PT.string,
  href: PT.string,
  rotated: PT.bool,
  id: PT.string,
};

export default ChartTooltip;
