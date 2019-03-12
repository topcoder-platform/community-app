/**
 * ContentSlider component
 *
 * This is mostly a clone of the Slider component found in tc-communities.
 */
/* global window */
import React, { Component } from 'react';
import _ from 'lodash';
import Carousel from 'nuka-carousel';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';
import { isomorphy } from 'topcoder-react-utils';
import { fixStyle } from 'utils/contentful';

import ArrowNext from 'assets/images/arrow_right.svg';
import ArrowPrev from 'assets/images/arrow-left.svg';
import defaultTheme from './themes/default.scss';


class CarouselInject extends Carousel {
  constructor(props) {
    super(props);
    this.handleClick = _.noop;
  }
}

class ContentSlider extends Component {
  constructor(props) {
    super(props);

    this.updateControlUI = this.updateUI.bind(this);
    this.state = { currentSlide: 0 };
  }

  /**
   * update ui after slide
   */
  updateUI() {
    if (!this.carousel) return;
    const { currentSlide } = this.state;
    if (currentSlide !== this.carousel.state.currentSlide) {
      this.setState({ currentSlide: this.carousel.state.currentSlide });
    }
  }

  render() {
    const {
      children, theme, autoStart, duration, id, containerStyle,
    } = this.props;
    const { currentSlide } = this.state;
    const decorators = [];
    decorators.push({
      component: () => (
        <div className={theme.control}>
          <a
            onClick={() => this.carousel && this.carousel.previousSlide()}
            onKeyPress={() => this.carousel && this.carousel.previousSlide()}
            role="button"
            tabIndex={0}
          >
            <ArrowPrev />
          </a>
          {`  ${currentSlide + 1}/${children.length}  `}
          <a
            onClick={() => this.carousel && this.carousel.nextSlide()}
            onKeyPress={() => this.carousel && this.carousel.nextSlide()}
            role="button"
            tabIndex={0}
          >
            <ArrowNext />
          </a>
        </div>
      ),
      position: 'BottomCenter',
    });

    return (
      <div
        className={theme.container}
        id={id}
        style={fixStyle(containerStyle)}
      >
        <CarouselInject
          beforeSlide={(currSlide, endSlide) => {
            if (isomorphy.isClientSide()) {
              const list = window.document.querySelector('.slider-list');
              const slidesCount = list.childNodes.length;
              const nextSlide = list.childNodes[endSlide % slidesCount];
              list.style.height = `${nextSlide.offsetHeight}px`;
            }
          }}
          afterSlide={() => setImmediate(() => this.updateUI())}
          decorators={decorators}
          ref={(node) => {
            this.carousel = node;
            if (node) this.updateUI();
          }}
          dragging={false}
          wrapAround
          autoplay={autoStart}
          autoplayInterval={duration * 1000}
          className={theme.content}
        >
          {children}
        </CarouselInject>
      </div>
    );
  }
}

ContentSlider.defaultProps = {
  theme: {},
  autoStart: true,
  duration: 5, // 5sec
  containerStyle: null,
};

ContentSlider.propTypes = {
  id: PT.string.isRequired,
  children: PT.node.isRequired,
  autoStart: PT.bool,
  duration: PT.number,
  theme: PT.shape({
    container: PT.string,
    content: PT.string,
    control: PT.string,
  }),
  containerStyle: PT.shape(),
};

export default themr('Contentful-Slider', defaultTheme)(ContentSlider);
