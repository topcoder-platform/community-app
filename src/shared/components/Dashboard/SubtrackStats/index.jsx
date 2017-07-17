/* global window */

import React from 'react';
import PT from 'prop-types';
import Slider from 'react-slick';
import _ from 'lodash';

import config from 'utils/config';
import { stripUnderscore, getRatingColor } from 'utils/tc';
import './styles.scss';

export default class SubtrackStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  getSlidesNumber() {
    const width = this.state.width;
    if (width >= 1350) {
      return 7;
      // desktop
    } else if (width >= 1180) {
      // desktop
      return 6;
    } else if (width >= 1010) {
      // desktop
      return 5;
    }
    // tablet & mobile
    return 4;
  }

  updateDimensions() {
    this.setState({ width: window.innerWidth });
  }

  render() {
    const { subtracks, handle } = this.props;

    const subtracksEle = tracks => (
      <div styleName="slide-wrapper">
        {
            tracks.map(subtrack => (
              <a
                href={
                  `${config.URL.BASE}/members/${handle}/details/` +
                  `?track=${subtrack.track}&subTrack=${subtrack.subTrack}`
                }
                styleName="track"
                key={subtrack.track + subtrack.subTrack}
              >
                <div styleName="flex-wrapper">
                  <p
                    styleName="subtrack"
                    title={stripUnderscore(subtrack.subTrack)}
                  >
                    {stripUnderscore(subtrack.subTrack)}
                  </p>
                  <p
                    styleName="rating"
                    style={{ color: subtrack.track === 'DESIGN' ? '#21B2F1' : getRatingColor(subtrack.stat) }}
                  >
                    {subtrack.stat}
                    {
                      (subtrack.track === 'DEVELOP' || subtrack.track === 'DATA_SCIENCE') &&
                        (<span style={{ backgroundColor: getRatingColor(subtrack.stat) }} />)
                    }
                  </p>
                  <p>{subtrack.statType}</p>
                </div>
              </a>
            ))
          }
      </div>
      );

    const navButton = () => (<span />);

    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      prevArrow: navButton(),
      nextArrow: navButton(),
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: true,
    };

    return (
      <div styleName="subtrack-stats">
        {
          subtracks && subtracks.length > 0 &&
          <div styleName="ratings">
            <div styleName="tracks">
              {
                subtracksEle(subtracks)
              }
            </div>
            <div styleName="responsive-carousel">
              <Slider {...settings}>
                {
                  _.chunk(subtracks, this.getSlidesNumber()).map(chunk => (
                    <div key={chunk[0].track + chunk[0].subTrack}>
                      {
                        subtracksEle(chunk)
                      }
                    </div>
                  ))
                }
              </Slider>
            </div>
          </div>
        }
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
