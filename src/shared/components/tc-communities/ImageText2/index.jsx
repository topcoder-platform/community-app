/**
 * A generic version of ImageText component; to be preferred over that one.
 */

import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';
import defaultStyle from './style.scss';

function ImageText2(props) {
  const { imageUrl, theme, children } = props;
  return (
    <div className={theme.container}>
      <div
        className={theme.image}
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      />
      <div className={theme.content}>{children}</div>
    </div>
  );
}

ImageText2.defaultProps = {
  imageUrl: '',
  theme: {},
  children: null,
};

ImageText2.propTypes = {
  imageUrl: PT.string,
  theme: PT.shape({
    container: PT.string,
    image: PT.string,
    imageContainer: PT.string,
    content: PT.string,
  }),
  children: PT.node,
};

export default themr('ImageText2', defaultStyle)(ImageText2);
