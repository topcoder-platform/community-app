/**
 * The core shape rendering.
 */

import PT from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { themr } from 'react-css-super-themr';
import { fixStyle } from 'utils/contentful';
import SVG from 'react-inlinesvg';

import LoadingIndicator from 'components/LoadingIndicator';
import defaultTheme from './themes/default.scss';

export function ShapeInner({
  theme,
  id,
  shape,
  shapeSvg,
}) {
  const {
    height,
    backgroundColor,
    inline,
  } = shape;

  const shapeSvgUrl = _.get(shapeSvg, 'file.url');
  const style = fixStyle(shape.extraStylesForContainer) || {};
  if (!shapeSvgUrl) {
    return (
      <div
        id={id}
        className={theme['shape-wrap']}
        style={style}
      />
    );
  }
  if (!inline) {
    style.backgroundImage = `url(${shapeSvgUrl})`;
  }
  if (height) {
    style.height = height;
  }
  if (backgroundColor) {
    style.backgroundColor = backgroundColor;
  }
  return (
    <div
      id={id}
      className={theme['shape-wrap']}
      style={style}
    >
      {inline && (
        <SVG
          preloader={<LoadingIndicator />}
          src={shapeSvgUrl}
        />
      )}
    </div>
  );
}

ShapeInner.defaultProps = {
  shapeSvg: null,
};

ShapeInner.propTypes = {
  id: PT.string.isRequired,
  shape: PT.shape().isRequired,
  shapeSvg: PT.shape(),
  theme: PT.shape({
    'shape-wrap': PT.string,
  }).isRequired,
};

export default themr('Shape', defaultTheme)(ShapeInner);
