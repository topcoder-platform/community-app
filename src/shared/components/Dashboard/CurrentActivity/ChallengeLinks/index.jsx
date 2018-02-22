import React from 'react';
import PT from 'prop-types';

import { challengeLinks as getLink } from 'utils/tc';
import './style.scss';

export default function ChallengeLinks({ challenge }) {
  return (
    <div styleName="challenge-links tile-view">
      <a href={getLink(challenge, 'registrants')} styleName="registrants">
        <div styleName="icon registrants-icon" />
        {challenge.subTrack === 'MARATHON_MATCH' && <p>{challenge.numRegistrants[0]}</p>}
        {challenge.subTrack !== 'MARATHON_MATCH' && <p>{challenge.numRegistrants}</p>}
      </a>
      <a href={getLink(challenge, 'submissions')} styleName="submissions">
        <div styleName="icon submissions-icon" />
        <p>{challenge.numSubmissions}</p>
      </a>
      <a href={getLink(challenge, 'forums')} styleName="forum">
        <div styleName="icon forum-icon" />
        <p>Posts</p>
      </a>
    </div>
  );
}

ChallengeLinks.propTypes = {
  challenge: PT.shape().isRequired,
};
