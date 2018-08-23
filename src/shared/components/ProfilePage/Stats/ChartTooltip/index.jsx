/**
 * Chart tooltip.  Displays the stats of a TopCoder member.
 */
/* eslint-env browser */
import React from 'react';
import PT from 'prop-types';
import { Link } from 'react-router-dom';
import './styles.scss';

const ChartTooltip = ({
  show, left, top, challengeName,
  challengeData, rating, ratingColor, challengeId,
}) => (
  <Link
    styleName="chart-tooltip"
    style={{
      opacity: show ? 1 : 0,
      left,
      top,
      pointerEvents: challengeId > 0 ? 'all' : 'none',
    }}
    to={`/challenges/${challengeId}`}
    onClick={e => e.stopPropagation()}
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
  </Link>
);


ChartTooltip.defaultProps = {
  show: false,
  left: 0,
  top: 0,
  challengeName: '',
  challengeData: '',
  rating: 0,
  ratingColor: '',
  challengeId: 0,
};

ChartTooltip.propTypes = {
  show: PT.bool,
  left: PT.number,
  top: PT.number,
  challengeName: PT.string,
  challengeData: PT.string,
  rating: PT.number,
  ratingColor: PT.string,
  challengeId: PT.number,
};

export default ChartTooltip;
