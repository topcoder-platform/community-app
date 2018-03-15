import PT from 'prop-types';
import React from 'react';
import { SecondaryButton } from 'topcoder-react-ui-kit';

import style from './style.scss';

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
      <p>{text}</p>
      <SecondaryButton
        theme={{ button: style.button }}
      >Register for this challenge</SecondaryButton>
    </div>
  );
}

ChallengeCard.propTypes = {
  imgUrl: PT.string.isRequired,
  title: PT.string.isRequired,
  text: PT.string.isRequired,
};
