/**
 * The Dial component shows a single competition track statistic.
 */

import _ from 'lodash';
import config from 'utils/config';
import PT from 'prop-types';
import React from 'react';

import { getRatingLevel } from 'utils/tc';

import './style.scss';

export default function Dial({
  handle,
  track,
  subTrack,
  metric,
  value,
}) {
  const title = _.startCase(subTrack);

  let ratingType;
  if (metric === 'Rating') ratingType = `rating-${getRatingLevel(value)}`;
  else {
    switch (track) {
      case 'DATA_SCIENCE': ratingType = 'ratingInDataScience'; break;
      case 'DESIGN': ratingType = 'ratingInDesign'; break;
      case 'DEVELOP': ratingType = 'ratingInDevelopment'; break;
      default: ratingType = 'rating';
    }
  }

  return (
    <a
      href={
        `${config.URL.BASE}/members/${handle}/details/` +
          `?track=${track}&subTrack=${subTrack}`
      }
      styleName="container"
      key={track + subTrack}
    >
      <p styleName="title" title={title}>{_.startCase(title)}</p>
      <p
        styleName={ratingType}
      >{value.toLocaleString()}</p>
      <p styleName="label">{metric}</p>
    </a>
  );
}

Dial.propTypes = {
  handle: PT.string.isRequired,
  track: PT.string.isRequired,
  subTrack: PT.string.isRequired,
  metric: PT.string.isRequired,
  value: PT.number.isRequired,
};
