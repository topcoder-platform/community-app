import React from 'react';
import PT from 'prop-types';
import './style.scss';

function ChallengeProgressBar({
  color, value, isLate, timeLeft,
}) {
  const prgrWidth = value > 100 ? 100 : value;
  return (
    <div>
      <div styleName="challenge-progress-bar">
        <div styleName={`fill ${isLate ? 'red' : color}`} style={{ width: `${isLate ? 100 : prgrWidth}%` }} />
      </div>
      <div styleName={`time-left ${isLate ? 'red' : color}`}>
        {timeLeft}
      </div>
    </div>
  );
}

ChallengeProgressBar.defaultProps = {
  color: '',
  value: 150,
  isLate: false,
  timeLeft: '',
};

ChallengeProgressBar.propTypes = {
  color: PT.string,
  value: PT.oneOfType([PT.string, PT.number]),
  isLate: PT.oneOfType([PT.bool, PT.string]),
  timeLeft: PT.string,
};

export default ChallengeProgressBar;
