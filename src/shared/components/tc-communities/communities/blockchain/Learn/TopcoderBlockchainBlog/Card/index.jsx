/**
 * Renders a single article card.
 */

import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default function Card({ fullWidth, item }) {
  return (
    <div styleName={fullWidth ? 'full-width-container' : 'container'}>
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
        /* eslint-enable react/no-danger */
      />
      <a
        href={item.link}
        styleName="readMore"
        target="_blank"
        rel="noopener noreferrer"
      >
Read More...
      </a>
      <div styleName="mask" />
    </div>
  );
}

Card.defaultProps = {
  fullWidth: false,
};

Card.propTypes = {
  fullWidth: PT.bool,
  item: PT.shape({
    'content:encoded': PT.string.isRequired,
    link: PT.string.isRequired,
    title: PT.string.isRequired,
  }).isRequired,
};
