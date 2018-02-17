import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default function Card({
  link,
  text,
  title,
}) {
  return (
    <div styleName="container">
      <h1 styleName="title">
        <a
          href={link}
          rel="noopener noreferrer"
          target="_blank"
        >{title}</a>
      </h1>
      <div
        /* eslint-disable react/no-danger */
        dangerouslySetInnerHTML={{ __html: text }}
        /* eslint-enable react/no-danger */
        styleName="content"
      />
      <div styleName="fade" />
      <a
        href={link}
        rel="noopener noreferrer"
        styleName="readMore"
        target="_blank"
      >Read More</a>
    </div>
  );
}

Card.propTypes = {
  link: PT.string.isRequired,
  text: PT.string.isRequired,
  title: PT.string.isRequired,
};
