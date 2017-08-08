/* eslint jsx-a11y/no-static-element-interactions:0 */
/*
  Stateless tab control to switch between various views available in
  challenge detail page.
*/

import React from 'react';
import PT from 'prop-types';

import './style.scss';

function getSelectorStyle(selectedView, currentView, track) {
  return `challenge-selector-common ${(selectedView === currentView ?
    `${track}-accent-color ${track}-accent-bottom-border` : 'challenge-unselected-view')}`;
}

export default function ChallengeViewSelector(props) {
  const {
    onSelectorClicked,
    trackLower,
    selectedView,
    numRegistrants,
    status,
    hasCheckpoints,
  } = props;
  return (
    <div styleName="challenge-view-selector">
      <a
        onClick={(e) => { e.preventDefault(); onSelectorClicked('DETAILS'); }}
        styleName={getSelectorStyle(selectedView, 'DETAILS', trackLower)}
      >DETAILS
      </a>
      <a
        onClick={(e) => { e.preventDefault(); onSelectorClicked('REGISTRANTS'); }}
        styleName={getSelectorStyle(selectedView, 'REGISTRANTS', trackLower)}
      >REGISTRANTS {numRegistrants ? `(${numRegistrants})` : ''}
      </a>
      {
        hasCheckpoints &&
        <a
          onClick={(e) => { e.preventDefault(); onSelectorClicked('CHECKPOINTS'); }}
          styleName={getSelectorStyle(selectedView, 'CHECKPOINTS', trackLower)}
        >CHECKPOINTS
        </a>
      }
      {
        status === 'COMPLETED' &&
        <a
          onClick={(e) => { e.preventDefault(); onSelectorClicked('SUBMISSIONS'); }}
          styleName={getSelectorStyle(selectedView, 'SUBMISSIONS', trackLower)}
        >
          SUBMISSIONS
        </a>
      }
      {
        status === 'COMPLETED' &&
        <a
          onClick={(e) => { e.preventDefault(); onSelectorClicked('WINNERS'); }}
          styleName={getSelectorStyle(selectedView, 'WINNERS', trackLower)}
        >WINNERS
        </a>
      }
      <a
        onClick={(e) => { e.preventDefault(); onSelectorClicked('CHALLENGE_FORUM'); }}
        styleName={getSelectorStyle(selectedView, 'CHALLENGE_FORUM', trackLower)}
      >CHALLENGE FORUM
      </a>
    </div>
  );
}

ChallengeViewSelector.defaultProps = {
  numRegistrants: 0,
};

ChallengeViewSelector.propTypes = {
  onSelectorClicked: PT.func.isRequired,
  trackLower: PT.string.isRequired,
  selectedView: PT.string.isRequired,
  numRegistrants: PT.number,
  status: PT.string.isRequired,
  hasCheckpoints: PT.bool.isRequired,
};
