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
  stat,
  statType,
  subTrack,
  track,
}) {
  const title = _.startCase(subTrack);

  let ratingType;
  if (statType === 'Rating') ratingType = `rating-${getRatingLevel(stat)}`;
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
      <p styleName="title" title={title}>{title}</p>
      <p
        styleName={ratingType}
      >{stat.toLocaleString()}</p>
      <p styleName="label">{statType}</p>
    </a>
  );
}

Dial.propTypes = {
  handle: PT.string.isRequired,
  stat: PT.number.isRequired,
  statType: PT.string.isRequired,
  subTrack: PT.string.isRequired,
  track: PT.string.isRequired,
};
