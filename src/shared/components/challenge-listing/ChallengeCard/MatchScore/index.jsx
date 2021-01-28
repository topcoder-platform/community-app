import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default function MatchScore({ score }) {
  return (
    <span styleName="match-score">
      {score}% match
    </span>
  );
}

MatchScore.defaultProps = {
  score: 0,
};

MatchScore.propTypes = {
  score: PT.number,
};
