import React from 'react';
import PT from 'prop-types';
import cn from 'classnames';

import { challengeLinks as getLink } from 'utils/tc';
import './style.scss';

const ChallengeLinks = (props) => {
  const { viewMode, challenge } = props;
  return (
    <div styleName={cn(['challenge-links', `${viewMode}-view`])}>
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
};

ChallengeLinks.propTypes = {
  viewMode: PT.oneOf(['tile', 'list']).isRequired,
  challenge: PT.shape().isRequired,
};

export default ChallengeLinks;
