import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default function ChallengeCard({
  imgUrl,
  title,
  text,
}) {
  return (
    <div styleName="container">
      <img
        alt="Challenge Thumbnail"
        src={imgUrl}
        styleName="thumbnail"
      />
      <h1 styleName="h1">{title}</h1>
      <div>{text}</div>
    </div>
  );
}

ChallengeCard.propTypes = {
  imgUrl: PT.string.isRequired,
  title: PT.string.isRequired,
  text: PT.string.isRequired,
};
