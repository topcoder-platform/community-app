import _ from 'lodash';
import Carousel from 'components/Carousel';
import PT from 'prop-types';
import React from 'react';

import Dial from './Dial';
import LArrow from '../../../../../assets/images/arrow-prev.svg';
import RArrow from '../../../../../assets/images/arrow-next.svg';

import './style.scss';

/**
 * Transforms stats object to a more convenient array representation.
 * @param {Object} stats
 * @return {Array}
 */
function transformStats(stats) {
  const res = [];

  const push = (track, subTrack, data) => {
    if (!_.isPlainObject(data)) return;
    if (data.rank && data.rank.rating) {
      res.push({
        track,
        subTrack,
        metric: 'Rating',
        value: data.rank.rating,
      });
    } else if (data.wins) {
      res.push({
        track,
        subTrack,
        metric: 'Victories',
        value: data.wins,
      });
    }
  };

  let s = stats.COPILOT;
  if (s) {
    s = (s.contests || 0) - (s.failures || 0);
    if (s) {
      res.push({
        track: 'COPILOT',
        subTrack: 'COPILOT',
        metric: 'Successful Challenges',
        value: s,
      });
    }
  }

  s = stats.DATA_SCIENCE;
  if (s) _.forIn(s, (x, key) => push('DATA_SCIENCE', key, x));

  s = _.get(stats.DESIGN, 'subTracks');
  if (s) s.forEach(x => push('DESIGN', x.name, x));

  s = _.get(stats.DEVELOP, 'subTracks');
  if (s) s.forEach(x => push('DEVELOP', x.name, x));

  return res;
}

export default function Records({ stats }) {
  return (
    <div>
      <Carousel
        NextButton={RArrow}
        PrevButton={LArrow}
        slideWidth="200px"
      >
        {
          transformStats(stats).map(item => (
            <Dial
              key={`${item.track}-${item.subTrack}`}
              handle={stats.handle}
              track={item.track}
              subTrack={item.subTrack}
              metric={item.metric}
              value={item.value}
            />
          ))
        }
      </Carousel>
    </div>
  );
}

Records.propTypes = {
  stats: PT.shape().isRequired,
};
