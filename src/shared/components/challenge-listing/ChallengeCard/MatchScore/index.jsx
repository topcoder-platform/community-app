import PT from 'prop-types';
import React from 'react';
import { DevelopmentTrackEventTag } from 'topcoder-react-ui-kit';
import './style.scss';

export default function MatchScore({ score }) {
  return (
    <div styleName="matchScoreTag">
      <DevelopmentTrackEventTag>
        {score}% match
      </DevelopmentTrackEventTag>
    </div>
  );
}

MatchScore.defaultProps = {
  score: 0,
};

MatchScore.propTypes = {
  score: PT.number,
};
