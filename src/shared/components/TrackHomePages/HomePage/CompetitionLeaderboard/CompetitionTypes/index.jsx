/**
 * Competition Types Carousel Component
 */
/* eslint-disable react/no-danger */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import showdown from 'showdown';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import ArrowNext from 'assets/images/arrow-next.svg';
import ArrowPrev from 'assets/images/arrow-prev.svg';
import TrackIcon from '../TrackIcon';

import './styles.scss';

const converter = new showdown.Converter();

class CompetitionTypes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      data: props.data.tracks,
      challengeURL: props.data.tracks[0].fields.viewChallengesLink,
    };
  }

  changeCarouselItem = (index) => {
    const { data } = this.state;
    if (index < 0 || index === data.length) return;
    this.setState({
      activeIndex: index,
      challengeURL: data[index].fields.viewChallengesLink,
    });
  }

  render() {
    const {
      track,
      data,
    } = this.props;

    const types = _.assign({}, data.tracks);
    const {
      activeIndex,
      challengeURL,
    } = this.state;

    const currentIndex = parseInt(activeIndex, 10);

    return (
      <div styleName="container">
        <h1>
Competition Types
        </h1>
        <div
          styleName="text"
          dangerouslySetInnerHTML={
            { __html: converter.makeHtml(data.description) }
          }
        />
        <div styleName="track-icons">
          {
            _.map(types, (type, index) => (
              <a key={type.fields.trackName} role="link" tabIndex={0}>
                <TrackIcon
                  track={track}
                  abbreviation={type.fields.abbreviation}
                  isBigIcon={false}
                  onClick={() => this.changeCarouselItem(index)}
                  isActive={index === currentIndex.toString()}
                />
              </a>
            ))
          }
        </div>
        <div styleName="carousel">
          <a
            onClick={() => this.changeCarouselItem(currentIndex - 1)}
            onKeyPress={() => this.changeCarouselItem(currentIndex - 1)}
            role="button"
            styleName={`arrow ${currentIndex > 0 ? 'active' : ''}`}
            tabIndex={0}
          >
            <ArrowPrev />
          </a>
          <div styleName="track-infos">
            {
              _.map(types, (type, index) => (
                <div styleName={`info ${index === currentIndex.toString() ? 'active' : ''}`} key={type.fields.trackName}>
                  <div styleName="mobile">
                    <div styleName="big-icon-mobile">
                      <TrackIcon
                        track={track}
                        abbreviation={type.fields.abbreviation}
                        isActive={index === currentIndex.toString()}
                      />
                    </div>
                    <div styleName="mobile-title">
                      { type.fields.trackName}
                    </div>
                  </div>
                  <div styleName="big-icon">
                    <TrackIcon
                      track={track}
                      abbreviation={type.fields.abbreviation}
                      isActive={index === currentIndex.toString()}
                    />
                  </div>
                  <div styleName="intro">
                    <div styleName="title">
                      { type.fields.trackName}
                    </div>
                    <div styleName="description">
                      { type.fields.description}
                    </div>
                    <div styleName="period">
                      { type.fields.estimatedDuration}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          <a
            onClick={() => this.changeCarouselItem(currentIndex + 1)}
            onKeyPress={() => this.changeCarouselItem(currentIndex + 1)}
            role="button"
            styleName={`arrow ${currentIndex < data.tracks.length - 1 ? 'active' : ''}`}
            tabIndex={0}
          >
            <ArrowNext />
          </a>
        </div>
        <div styleName="button-wrapper">
          <PrimaryButton to={challengeURL} openNewTab>
            Browse Challenges
          </PrimaryButton>
        </div>
      </div>
    );
  }
}

CompetitionTypes.propTypes = {
  track: PT.string.isRequired,
  data: PT.shape().isRequired,
};

export default CompetitionTypes;
