import PT from 'prop-types';
import React from 'react';
import Slider from 'react-slick';

import ArrowNext from '../../../../assets/images/arrow-next.svg';
import ArrowPrev from '../../../../assets/images/arrow-prev.svg';

import Dial from './Dial';

import './style.scss';

export default class SubtrackStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { subtracks, handle } = this.props;

    const maxSlides = Math.min(10, subtracks.length);

    const responsive = [];
    for (let i = 1; i <= maxSlides; i += 1) {
      responsive.push({
        breakpoint: 100 * i,
        settings: {
          slidesToScroll: i,
          slidesToShow: i,
        },
      });
    }

    return (
      <div styleName="container">
        <Slider
          infinite={false}
          nextArrow={<div><ArrowNext /></div>}
          prevArrow={<div><ArrowPrev /></div>}
          responsive={responsive}
          slidesToScroll={maxSlides}
          slidesToShow={maxSlides}
          styleName="slider"
        >
          {
            subtracks.map(item => (
              <div>
                <Dial
                  handle={handle}
                  stat={item.track === 'COPILOT' ? (
                    item.contests - item.failures
                  ) : item.stat}
                  statType={item.statType}
                  subTrack={item.subTrack}
                  track={item.track}
                />
              </div>
            ))
          }
        </Slider>
      </div>
    );
  }
}

SubtrackStats.propTypes = {
  subtracks: PT.arrayOf(PT.shape()),
  handle: PT.string,
};

SubtrackStats.defaultProps = {
  subtracks: [],
  handle: '',
};
