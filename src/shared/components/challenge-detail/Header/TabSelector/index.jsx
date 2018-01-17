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

import style from './style.scss';

function getSelectorStyle(selectedView, currentView) {
  return `challenge-selector-common ${(selectedView === currentView ?
    'challenge-selected-view' : 'challenge-unselected-view')}`;
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
    trackLower,
    hasRegistered,
  } = props;

  const forumId = _.get(challenge, 'forumId') || 0;
  const roles = _.get(challenge, 'userDetails.roles') || [];

  const forumEndpoint = trackLower === 'design'
    ? `/?module=ThreadList&forumID=${forumId}`
    : `/?module=Category&categoryID=${forumId}`;

  const handleSelectorClicked = (e, selector) => {
    /* eslint-env browser */
    e.preventDefault();
    onSelectorClicked(selector);
  };

  const handleScroll = (e) => {
    const scrollElement = e.target;

    const cname = style.mask;
    /* eslint-env browser */
    const masks = document.getElementsByClassName(cname);
    const mask1 = masks[0];
    const mask2 = masks[1];
    // When the scrollbar reaches end, disable right mask.
    if (scrollElement.scrollWidth - scrollElement.scrollLeft === scrollElement.clientWidth) {
      mask2.style.display = 'none';
    } else if (scrollElement.scrollLeft === 0) {
      // At the beginning, disable left mask.
      mask1.style.display = 'none';
    } else {
      // Show both masks in between.
      mask1.style.display = 'block';
      mask2.style.display = 'block';
    }
  };

  return (
    <div
      styleName="container"
      onScroll={handleScroll}
    >
      <div styleName="mask left" />
      <div styleName="mask right" />
      <div styleName="challenge-view-selector">
        <a
          onClick={(e) => { handleSelectorClicked(e, DETAIL_TABS.DETAILS); }}
          styleName={getSelectorStyle(selectedView, DETAIL_TABS.DETAILS)}
        >DETAILS
        </a>
        {
          numRegistrants ? (
            <a
              onClick={(e) => {
                handleSelectorClicked(e, DETAIL_TABS.REGISTRANTS);
              }}
              styleName={getSelectorStyle(selectedView, DETAIL_TABS.REGISTRANTS)}
            >REGISTRANTS ({numRegistrants})
            </a>
          ) : null
        }
        {
          trackLower === 'design' && checkpointCount > 0 &&
          <a
            onClick={(e) => { handleSelectorClicked(e, DETAIL_TABS.CHECKPOINTS); }}
            styleName={getSelectorStyle(selectedView, DETAIL_TABS.CHECKPOINTS)}
          >CHECKPOINTS ({checkpointCount})
          </a>
        }
        {
          numSubmissions ? (
            <a
              onClick={(e) => { handleSelectorClicked(e, DETAIL_TABS.SUBMISSIONS); }}
              styleName={getSelectorStyle(selectedView, DETAIL_TABS.SUBMISSIONS)}
            >SUBMISSIONS ({numSubmissions})</a>
          ) : null
        }
        {
          numWinners ? (
            <a
              onClick={(e) => { handleSelectorClicked(e, DETAIL_TABS.WINNERS); }}
              styleName={getSelectorStyle(selectedView, DETAIL_TABS.WINNERS)}
            >WINNERS ({ numWinners })</a>
          ) : null
        }
        { (hasRegistered || Boolean(roles.length)) &&
          <a
            href={`${config.URL.FORUMS}${forumEndpoint}`}
            styleName={getSelectorStyle(selectedView, DETAIL_TABS.CHALLENGE_FORUM)}
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
  trackLower: PT.string.isRequired,
  hasRegistered: PT.bool.isRequired,
};
