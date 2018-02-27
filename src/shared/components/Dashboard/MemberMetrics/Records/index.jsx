import _ from 'lodash';
import Carousel from 'nuka-carousel';
import PT from 'prop-types';
import React from 'react';

import Dial from './Dial';
import LArrow from '../../../../../assets/images/arrow-prev.svg';
import RArrow from '../../../../../assets/images/arrow-next.svg';

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

export default class Records extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  check() {
    if (!this.carousel) return;
    const st = this.carousel.state;
    const showLeft = Boolean(st.currentSlide);
    const showRight = st.currentSlide < st.slideCount - st.slidesToScroll;
    const align = st.slideCount === 'auto'
    || st.slidesToScroll >= st.slideCount;
    if (showLeft === this.state.showLeft
    && showRight === this.state.showRight
    && align === this.state.align) return;
    this.setState({ align, showLeft, showRight });
  }

  render() {
    const st = this.state;
    const { stats } = this.props;

    const decorators = [];
    if (st.showLeft) {
      decorators.push({
        component: () => (
          <LArrow
            onClick={() => this.carousel && this.carousel.previousSlide()}
          />
        ),
        position: 'CenterLeft',
        style: {
          cursor: 'pointer',
          marginLeft: 40,
        },
      });
    }
    if (st.showRight) {
      decorators.push({
        component: () => (
          <RArrow
            onClick={() => this.carousel && this.carousel.nextSlide()}
          />
        ),
        position: 'CenterRight',
        style: {
          cursor: 'pointer',
          marginRight: 40,
        },
      });
    }

    return (
      <div
        style={{ display: this.state.align ? 'inline-block' : 'block' }}
      >
        <Carousel
          afterSlide={() => setImmediate(() => this.check())}
          decorators={decorators}
          framePadding="0 100px"
          ref={(node) => {
            this.carousel = node;
            if (node) this.check();
          }}
          slidesToScroll="auto"
          slideWidth="200px"
          width={
            this.state.align ? (
              (200 * this.carousel.state.slideCount) + 200
            ) : '100%'
          }
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
}

Records.propTypes = {
  stats: PT.shape().isRequired,
};
