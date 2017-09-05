/* eslint jsx-a11y/no-static-element-interactions:0 */
/*
  Stateless tab control to switch between various views available in
  challenge detail page.
*/

import _ from 'lodash';
import config from 'utils/config';
import React from 'react';
import PT from 'prop-types';
import { DETAIL_TABS } from 'actions/challenge';

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
    numSubmissions,
    numWinners,
    onSelectorClicked,
    selectedView,
    status,
    trackLower,
    hasRegistered,
  } = props;

  const forumId = _.get(challenge, 'forumId', 0);
  const roles = _.get(challenge, 'userDetails.roles', []);

  const forumEndpoint = trackLower === 'design'
    ? `/?module=ThreadList&forumID=${forumId}`
    : `/?module=Category&categoryID=${forumId}`;

  const handleSelectorClicked = (e, selector) => {
    /* eslint-env browser */
    e.preventDefault();
    onSelectorClicked(selector);
  };

  return (
    <div styleName="container">
      <div styleName="mask" />
      <div styleName="challenge-view-selector">
        <a
          onClick={(e) => { handleSelectorClicked(e, DETAIL_TABS.DETAILS); }}
          styleName={getSelectorStyle(selectedView, DETAIL_TABS.DETAILS, trackLower)}
        >DETAILS
        </a>
        <a
          onClick={(e) => { handleSelectorClicked(e, DETAIL_TABS.REGISTRANTS); }}
          styleName={getSelectorStyle(selectedView, DETAIL_TABS.REGISTRANTS, trackLower)}
        >REGISTRANTS {numRegistrants ? `(${numRegistrants})` : ''}
        </a>
        {
          trackLower === 'design' && checkpointCount > 0 &&
          <a
            onClick={(e) => { handleSelectorClicked(e, DETAIL_TABS.CHECKPOINTS); }}
            styleName={getSelectorStyle(
              selectedView,
              DETAIL_TABS.CHECKPOINTS,
              trackLower,
            )}
          >CHECKPOINTS ({checkpointCount})
          </a>
        }
        {
          status === 'COMPLETED' &&
          <a
            onClick={(e) => { handleSelectorClicked(e, DETAIL_TABS.SUBMISSIONS); }}
            styleName={getSelectorStyle(
              selectedView,
              DETAIL_TABS.SUBMISSIONS,
              trackLower,
            )}
          >SUBMISSIONS ({numSubmissions})
          </a>
        }
        {
          numWinners ? (
            <a
              onClick={(e) => { handleSelectorClicked(e, DETAIL_TABS.WINNERS); }}
              styleName={getSelectorStyle(selectedView, DETAIL_TABS.WINNERS, trackLower)}
            >WINNERS ({ numWinners })</a>
          ) : null
        }
        { (hasRegistered || Boolean(roles.length)) &&
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
  hasRegistered: false,
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
  numWinners: PT.number.isRequired,
  onSelectorClicked: PT.func.isRequired,
  selectedView: PT.string.isRequired,
  status: PT.string.isRequired,
  trackLower: PT.string.isRequired,
  hasRegistered: PT.bool.isRequired,
};
