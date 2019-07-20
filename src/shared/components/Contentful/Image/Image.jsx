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

import LoadingIndicator from 'components/LoadingIndicator';
import defaultTheme from './themes/default.scss';

export class ImageInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onLoadSvg = this.onLoadSvg.bind(this);
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
      imageSource,
      clipSvg,
    } = this.props;

    const imageUrl = _.get(imageSource, 'file.url');
    const clipSvgUrl = _.get(clipSvg, 'file.url');
    const imgStyle = image.extraStylesForImage ? fixStyle(image.extraStylesForImage) : {};
    console.log('imgStyle', imgStyle);
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
        <img
          src={imageUrl}
          alt=""
          style={imgStyle}
        />
      </div>
    );
  }
}

ImageInner.defaultProps = {
  clipSvg: null,
};

ImageInner.propTypes = {
  id: PT.string.isRequired,
  image: PT.shape().isRequired,
  imageSource: PT.shape().isRequired,
  clipSvg: PT.shape(),
  theme: PT.shape({
    'img-wrap': PT.string,
  }).isRequired,
};

export default themr('Image', defaultTheme)(ImageInner);
