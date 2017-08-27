/* eslint jsx-a11y/no-static-element-interactions:0 */
/*
  Stateless tab control to switch between various views available in
  challenge detail page.
*/

import _ from 'lodash';
import config from 'utils/config';
import React from 'react';
import PT from 'prop-types';

import './style.scss';

function getSelectorStyle(selectedView, currentView, track) {
  return `challenge-selector-common ${(selectedView === currentView ?
    `${track}-accent-color ${track}-accent-bottom-border` : 'challenge-unselected-view')}`;
}

export default function ChallengeViewSelector(props) {
  const {
    challenge,
    checkpointCount,
    numRegistrants,
    onSelectorClicked,
    selectedView,
    status,
    trackLower,
  } = props;

  const forumId = _.get(challenge, 'forumId', 0);
  const roles = _.get(challenge, 'userDetails.roles', []);

  const forumEndpoint = trackLower === 'design'
    ? `/?module=ThreadList&forumID=${forumId}`
    : `/?module=Category&categoryID=${forumId}`;

  return (
    <div styleName="container">
      <div styleName="mask" />
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
          trackLower === 'design' && checkpointCount > 0 &&
          <a
            onClick={(e) => { e.preventDefault(); onSelectorClicked('CHECKPOINTS'); }}
            styleName={getSelectorStyle(selectedView, 'CHECKPOINTS', trackLower)}
          >CHECKPOINTS ({checkpointCount})
          </a>
        }
        {
          status === 'COMPLETED' &&
          <a
            onClick={(e) => { e.preventDefault(); onSelectorClicked('SUBMISSIONS'); }}
            styleName={getSelectorStyle(selectedView, 'SUBMISSIONS', trackLower)}
          >SUBMISSIONS {numSubmissions ? `(${numSubmissions})` : ''}
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
        { Boolean(roles.length) &&
          <a
            href={`${config.URL.FORUMS}${forumEndpoint}`}
            styleName={getSelectorStyle(selectedView, 'CHALLENGE_FORUM', trackLower)}
          >CHALLENGE FORUM</a>
        }
      </div>
    </div>
  );
}

ChallengeViewSelector.defaultProps = {
  challenge: {},
  checkpointCount: 0,
  numRegistrants: 0,
  numSubmissions: 0,
};

ChallengeViewSelector.propTypes = {
  challenge: PT.shape({
    details: PT.shape({
      forumId: PT.number.isRequired,
    }),
    userDetails: PT.shape({
      roles: PT.arrayOf(PT.string),
    }),
  }),
  checkpointCount: PT.number,
  numRegistrants: PT.number,
  numSubmissions: PT.number,
  onSelectorClicked: PT.func.isRequired,
  selectedView: PT.string.isRequired,
  status: PT.string.isRequired,
  trackLower: PT.string.isRequired,
};
