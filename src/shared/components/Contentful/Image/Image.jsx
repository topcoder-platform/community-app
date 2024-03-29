/* eslint-disable max-len */
/**
 * The core image rendering.
 */

/* global document */

import PT from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { themr } from 'react-css-super-themr';
import { fixStyle } from 'utils/contentful';
import SVG from 'react-inlinesvg';
import { isomorphy } from 'topcoder-react-utils';

// AOS
import AOS from 'aos';

import LoadingIndicator from 'components/LoadingIndicator';
import defaultTheme from './themes/default.scss';

export class ImageInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onLoadSvg = this.onLoadSvg.bind(this);
  }

  componentDidMount() {
    const {
      animation,
    } = this.props;
    // Animations only on client side
    if (animation.animateOnScroll && isomorphy.isClientSide()) {
      AOS.init();
    }
  }

  componentDidUpdate() {
    const {
      clipSvg,
    } = this.props;
    const clipSvgUrl = _.get(clipSvg, 'file.url');
    if (clipSvgUrl) {
      this.onLoadSvg();
    }
  }

  /**
   * event call after load svg success
   */
  onLoadSvg() {
    const {
      id,
    } = this.props;
    const imgTag = document.querySelector(`#image-${id} img`);
    const svgClip = document.querySelector(`#image-${id} svg clipPath`);
    if (svgClip && imgTag) {
      svgClip.id = `svg-id-${id}`;
      imgTag.style['clip-path'] = `url(#${svgClip.id})`;
      imgTag.style['-webkit-clip-path'] = `url(#${svgClip.id})`;
      imgTag.style.display = 'block';
    }
  }

  render() {
    const {
      theme,
      id,
      image,
      imageSources,
      clipSvg,
      animation,
    } = this.props;
    const clipSvgUrl = _.get(clipSvg, 'file.url');
    const imgStyle = image.extraStylesForImage ? fixStyle(image.extraStylesForImage) : {};
    if (clipSvgUrl) {
      imgStyle.display = 'none';
    }

    return (
      <div
        id={`image-${id}`}
        className={theme['img-wrap']}
        style={fixStyle(image.extraStylesForContainer)}
      >
        {clipSvgUrl && (
          <SVG
            preloader={<LoadingIndicator />}
            src={clipSvgUrl}
            wrapper={React.createFactory('svg')}
            onLoad={this.onLoadSvg}
          />
        )}
        {
          animation.animateOnScroll ? (
            <picture>
              <source srcSet={imageSources.source.file.url} type={imageSources.source.file.contentType} media="(min-width: 769px)" />
              {
                imageSources.sourceMobile ? (
                  <source srcSet={imageSources.sourceMobile.file.url} type={imageSources.sourceMobile.file.contentType} media="(max-width: 768px)" />
                ) : (
                  <source srcSet={`${imageSources.source.file.url}?w=768`} type={imageSources.source.file.contentType} media="(max-width: 768px)" />
                )
              }
              <img
                src={`${imageSources.source.file.url}?fm=png`}
                alt={image.alt || image.name}
                style={imgStyle}
                data-aos={animation.animateOnScroll}
                data-aos-once={animation.animateOnScrollOnce}
                data-aos-delay={animation.animateOnScrollDelay}
                data-aos-duration={animation.animateOnScrollDuration}
                data-aos-easing={animation.animateOnScrollEasing}
                data-aos-mirror={animation.animateOnScrollMirror}
                data-aos-anchor-placement={animation.animateOnScrollAnchor}
                data-aos-offset={animation.animateOnScrollOffset}
                loading="lazy"
              />
            </picture>
          ) : (
            <picture>
              <source srcSet={imageSources.source.file.url} type={imageSources.source.file.contentType} media="(min-width: 769px)" />
              {
                imageSources.sourceMobile ? (
                  <source srcSet={imageSources.sourceMobile.file.url} type={imageSources.sourceMobile.file.contentType} media="(max-width: 768px)" />
                ) : (
                  <source srcSet={`${imageSources.source.file.url}?w=768`} type={imageSources.source.file.contentType} media="(max-width: 768px)" />
                )
              }
              <img
                src={`${imageSources.source.file.url}?fm=png`}
                alt={image.alt || image.name}
                style={imgStyle}
                loading="lazy"
              />
            </picture>
          )
        }
      </div>
    );
  }
}

ImageInner.defaultProps = {
  clipSvg: null,
  animation: {},
};

ImageInner.propTypes = {
  id: PT.string.isRequired,
  image: PT.shape().isRequired,
  imageSources: PT.shape().isRequired,
  clipSvg: PT.shape(),
  theme: PT.shape({
    'img-wrap': PT.string,
  }).isRequired,
  animation: PT.shape(),
};

export default themr('Image', defaultTheme)(ImageInner);
