/**
 * Renders a single article card.
 */

import PT from 'prop-types';
import React from 'react';
import { themr } from 'react-css-super-themr';
import defaultStyle from './style.scss';

function Card({
  fullWidth, item, theme, containerStyles,
}) {
  return (
    <div
      className={fullWidth ? theme.fullWidthContainer : theme.container}
      style={containerStyles}
    >
      <h3>
        <a
          href={item.link}
          rel="noopener noreferrer"
          target="_blank"
        >
          {item.title}
        </a>
      </h3>
      <div
        /* eslint-disable react/no-danger */
        dangerouslySetInnerHTML={{ __html: item['content:encoded'] }}
      />
      <a
        href={item.link}
        className={theme.readMore}
        target="_blank"
        rel="noopener noreferrer"
      >
Read More...
      </a>
      <div className={theme.mask} />
    </div>
  );
}

Card.defaultProps = {
  fullWidth: false,
  containerStyles: undefined,
};

Card.propTypes = {
  fullWidth: PT.bool,
  item: PT.shape({
    'content:encoded': PT.string.isRequired,
    link: PT.string.isRequired,
    title: PT.string.isRequired,
  }).isRequired,
  theme: PT.shape({
    container: PT.string.isRequired,
    fullWidthContainer: PT.string.isRequired,
    mask: PT.string.isRequired,
    readMore: PT.string.isRequired,
  }).isRequired,
  containerStyles: PT.shape(),
};

export default themr('Contentful-BlogFeed-Card', defaultStyle)(Card);
