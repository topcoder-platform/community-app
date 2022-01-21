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
import { fixStyle } from 'utils/contentful';

import GrayArrowNext from 'assets/images/slider-arrow-right.svg';
import GrayArrowPrev from 'assets/images/slider-arrow-left.svg';
import WhiteArrowNext from 'assets/images/new-arrow-right.svg';
import WhiteArrowPrev from 'assets/images/new-arrow-left.svg';
import defaultTheme from './themes/default.scss';


class CarouselInject extends Carousel {
  constructor(props) {
    super(props);
    this.handleClick = _.noop;
  }
}

// eslint-disable-next-line react/prefer-stateless-function
class ContentSlider extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  render() {
    const {
      children, theme, autoStart, duration, id, containerStyle,
      slidesToShow, framePadding, withoutControls, vertical, cellSpacing,
      cellAlign, wrapAround, heightMode, arrowTheme, hideSliderDots, themeName,
      arrowLeftImage, arrowRightImage,
    } = this.props;
    const renderControls = {
      renderCenterLeftControls: ({ previousSlide }) => (
        <a
          onClick={previousSlide}
          onKeyPress={previousSlide}
          role="button"
          tabIndex={0}
          className={theme.controlLeft}
        >
          {arrowRightImage && <img src={arrowRightImage.fields.file.url} alt="Slider left arrow" />}
          {!arrowRightImage && (arrowTheme === 'Gray' ? <GrayArrowNext /> : <WhiteArrowNext />)}
        </a>
      ),
      renderCenterRightControls: ({ nextSlide }) => (
        <a
          onClick={nextSlide}
          onKeyPress={nextSlide}
          role="button"
          tabIndex={0}
          className={theme.controlRight}
        >
          {arrowLeftImage && <img src={arrowLeftImage.fields.file.url} alt="Slider right arrow" />}
          {!arrowLeftImage && (arrowTheme === 'Gray' ? <GrayArrowPrev /> : <WhiteArrowPrev />)}
        </a>
      ),
    };
    if (hideSliderDots) {
      renderControls.renderBottomCenterControls = () => null;
    }
    if (themeName === 'Controls Bottom Right') {
      renderControls.renderCenterLeftControls = () => null;
      renderControls.renderCenterRightControls = () => null;
      renderControls.renderBottomRightControls = ({ previousSlide, nextSlide }) => (
        <div className={theme.bottomRightControls}>
          <a
            onClick={previousSlide}
            onKeyPress={previousSlide}
            role="button"
            tabIndex={0}
            className={theme.controlLeft}
          >
            {arrowLeftImage && <img src={arrowLeftImage.fields.file.url} alt="Slider left arrow" />}
            {!arrowLeftImage && (arrowTheme === 'Gray' ? <GrayArrowPrev /> : <WhiteArrowPrev />)}
          </a>
          <a
            onClick={nextSlide}
            onKeyPress={nextSlide}
            role="button"
            tabIndex={0}
            className={theme.controlRight}
          >
            {arrowRightImage && <img src={arrowRightImage.fields.file.url} alt="Slider right arrow" />}
            {!arrowRightImage && (arrowTheme === 'Gray' ? <GrayArrowNext /> : <WhiteArrowNext />)}
          </a>
        </div>
      );
    }

    return (
      <div
        className={theme.container}
        id={id}
        style={fixStyle(containerStyle)}
      >
        <CarouselInject
          dragging={false}
          autoplay={autoStart}
          autoplayInterval={duration * 1000}
          className={slidesToShow > 1 ? theme.multiContent : theme.singleContent}
          slidesToShow={slidesToShow}
          slidesToScroll="auto"
          cellAlign={cellAlign}
          heightMode={heightMode}
          framePadding={framePadding}
          withoutControls={withoutControls}
          vertical={vertical}
          cellSpacing={cellSpacing}
          wrapAround={wrapAround}
          {...renderControls}
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
  slidesToShow: 1,
  framePadding: null,
  withoutControls: false,
  vertical: false,
  cellSpacing: null,
  cellAlign: 'center',
  wrapAround: true,
  heightMode: 'max',
  arrowTheme: 'Gray',
  hideSliderDots: false,
  themeName: 'Default',
  arrowLeftImage: null,
  arrowRightImage: null,
};

ContentSlider.propTypes = {
  id: PT.string.isRequired,
  children: PT.node.isRequired,
  autoStart: PT.bool,
  duration: PT.number,
  theme: PT.shape(),
  containerStyle: PT.shape(),
  slidesToShow: PT.number,
  framePadding: PT.string,
  withoutControls: PT.bool,
  vertical: PT.bool,
  cellSpacing: PT.number,
  cellAlign: PT.string,
  wrapAround: PT.bool,
  heightMode: PT.string,
  arrowTheme: PT.string,
  hideSliderDots: PT.bool,
  themeName: PT.string,
  arrowLeftImage: PT.shape(),
  arrowRightImage: PT.shape(),
};

export default themr('Contentful-Slider', defaultTheme)(ContentSlider);
