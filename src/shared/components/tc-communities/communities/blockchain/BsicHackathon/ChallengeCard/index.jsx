import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default function ChallengeCard({
  imgUrl,
  title,
  text,
  winners,
}) {
  return (
    <div styleName="container">
      <img
        alt="Challenge Thumbnail"
        src={imgUrl}
        styleName="thumbnail"
      />
      <h1 styleName="h1">
        {title}
      </h1>
      <div styleName="content">
        <div>
          {text}
        </div>
        <div>
          {winners}
        </div>
      </div>
    </div>
  );
}

ChallengeCard.propTypes = {
  imgUrl: PT.string.isRequired,
  title: PT.string.isRequired,
  text: PT.string.isRequired,
  winners: PT.node.isRequired,
};
