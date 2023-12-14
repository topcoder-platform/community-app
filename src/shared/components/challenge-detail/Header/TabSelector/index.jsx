/* eslint jsx-a11y/no-static-element-interactions:0 */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/*
  Stateless tab control to switch between various views available in
  challenge detail page.
*/

import _ from 'lodash';
import React, { useState } from 'react';
import PT from 'prop-types';
import cn from 'classnames';
import { TABS as DETAIL_TABS } from 'actions/page/challenge-details';
import { config, Link } from 'topcoder-react-utils';
import { useMediaQuery } from 'react-responsive';
import ArrowIcon from 'assets/images/ico-arrow-down.svg';
import CloseIcon from 'assets/images/icon-close-green.svg';
import SortIcon from 'assets/images/icon-sort-mobile.svg';

import style from './style.scss';

function getSelectorStyle(selectedView, currentView) {
  return `challenge-selector-common ${(selectedView === currentView
    ? 'challenge-selected-view' : 'challenge-unselected-view')}`;
}

export default function ChallengeViewSelector(props) {
  const {
    isLoggedIn,
    challenge,
    isMM,
    checkpointCount,
    numOfRegistrants,
    numOfCheckpointSubmissions,
    numOfSubmissions,
    numWinners,
    onSelectorClicked,
    selectedView,
    trackLower,
    hasRegistered,
    mySubmissions,
    onSort,
    viewAsTable,
  } = props;

  let showDashboard;
  const { type, tags, metadata } = challenge;
  const dashboardMetadata = _.find(metadata, { name: 'show_data_dashboard' });
  if (dashboardMetadata) {
    if (_.isString(dashboardMetadata.value)) {
      showDashboard = dashboardMetadata.value === 'true';
    } else if (_.isBoolean(dashboardMetadata.value)) {
      showDashboard = dashboardMetadata.value;
    }
  }

  const [currentSelected, setCurrentSelected] = useState('Details');
  const [isTabClosed, setIsTabClosed] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState();
  const isF2F = type === 'First2Finish';
  const isBugHunt = _.includes(tags, 'Bug Hunt');
  const isDesign = trackLower === 'design';

  let SubmissionSortOptions = [
    { field: 'Rating', sort: 'desc', name: 'Rating: High to Low' },
    { field: 'Rating', sort: 'asc', name: 'Rating: Low to High' },
    { field: 'Username', sort: 'asc', name: 'Username' },
    { field: 'Submission Date', sort: 'desc', name: 'Submission Date: New to Old' },
    { field: 'Submission Date', sort: 'asc', name: 'Submission Date: Old to New' },
    { field: 'Initial Score', sort: 'desc', name: 'Initial Score: High to Low' },
    { field: 'Initial Score', sort: 'asc', name: 'Initial Score: Low to High' },
    { field: 'Final Score', sort: 'desc', name: 'Final Score: High to Low' },
    { field: 'Final Score', sort: 'asc', name: 'Final Score: Low to High' },
  ];

  let RegistrationSortOptions = [
    { field: 'Rating', sort: 'desc', name: 'Rating: High to Low' },
    { field: 'Rating', sort: 'asc', name: 'Rating: Low to High' },
    { field: 'Username', sort: 'asc', name: 'Username' },
    { field: 'Registration Date', sort: 'desc', name: 'Registration Date: New to Old' },
    { field: 'Registration Date', sort: 'asc', name: 'Registration Date: Old to New' },
    { field: 'Submitted Date', sort: 'desc', name: 'Submitted Date: New to Old' },
    { field: 'Submitted Date', sort: 'asc', name: 'Submitted Date: Old to New' },
  ];

  const MarathonSortOptions = [
    { field: 'Final Rank', sort: 'desc', name: 'Final Rank: High to Low' },
    { field: 'Final Rank', sort: 'asc', name: 'Final Rank: Low to High' },
    { field: 'Provisional Rank', sort: 'desc', name: 'Provisional Rank: High to Low' },
    { field: 'Provisional Rank', sort: 'asc', name: 'Provisional Rank: Low to High' },
    { field: 'Rating', sort: 'desc', name: 'Rating: High to Low' },
    { field: 'Rating', sort: 'asc', name: 'Rating: Low to High' },
    { field: 'Username', sort: 'asc', name: 'Username' },
    { field: 'Final Score', sort: 'desc', name: 'Final Score: High to Low' },
    { field: 'Final Score', sort: 'asc', name: 'Final Score: Low to High' },
    { field: 'Provisional Score', sort: 'desc', name: 'Provisional Score: High to Low' },
    { field: 'Provisional Score', sort: 'asc', name: 'Provisional Score: Low to High' },
    { field: 'Time', sort: 'desc', name: 'Submission Date: New to Old' },
    { field: 'Time', sort: 'asc', name: 'Submission Date: Old to New' },
  ];

  const MySubmissionsSortOptions = [
    { field: 'Submission ID', sort: 'desc', name: 'Submission ID: High to Low' },
    { field: 'Submission ID', sort: 'asc', name: 'Submission ID: Low to High' },
    { field: 'Status', sort: 'desc', name: 'Status: High to Low' },
    { field: 'Status', sort: 'asc', name: 'Status: Low to High' },
    { field: 'Final', sort: 'desc', name: 'Final Score: High to Low' },
    { field: 'Final', sort: 'asc', name: 'Final Score: Low to High' },
    { field: 'Provision', sort: 'desc', name: 'Provisional Score: High to Low' },
    { field: 'Provision', sort: 'asc', name: 'Provisional Score: Low to High' },
    { field: 'Time', sort: 'desc', name: 'Time: New to Old' },
    { field: 'Time', sort: 'asc', name: 'Time: Old to New' },
  ];

  if (isF2F || isBugHunt) {
    SubmissionSortOptions = SubmissionSortOptions.slice(2);
  }

  if (isMM) {
    SubmissionSortOptions = MarathonSortOptions;
  }

  if (isDesign) {
    RegistrationSortOptions = RegistrationSortOptions.slice(2);
  }

  let sortOptions = currentSelected === DETAIL_TABS.SUBMISSIONS
    ? SubmissionSortOptions : RegistrationSortOptions;

  if (currentSelected === DETAIL_TABS.MY_SUBMISSIONS) {
    sortOptions = MySubmissionsSortOptions;
  }

  const numOfSub = numOfSubmissions + (numOfCheckpointSubmissions || 0);
  const forumId = _.get(challenge, 'legacy.forumId') || 0;
  const discuss = _.get(challenge, 'discussions', []).filter(d => (
    d.type === 'challenge' && !_.isEmpty(d.url)
  ));
  const roles = _.get(challenge, 'userDetails.roles') || [];

  const forumEndpoint = isDesign
    ? `/?module=ThreadList&forumID=${forumId}`
    : `/?module=Category&categoryID=${forumId}`;

  const handleSelectorClicked = (e, selector) => {
    /* eslint-env browser */
    e.preventDefault();
    setCurrentSelected(selector);
    setIsTabClosed(true);
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

  const desktop = useMediaQuery({ minWidth: 1024 });

  const tabDetail = (
    <React.Fragment>
      <a
        tabIndex="0"
        role="tab"
        aria-selected={selectedView === DETAIL_TABS.DETAILS}
        onClick={(e) => { handleSelectorClicked(e, DETAIL_TABS.DETAILS); }}
        onKeyPress={(e) => { handleSelectorClicked(e, DETAIL_TABS.DETAILS); }}
        styleName={getSelectorStyle(selectedView, DETAIL_TABS.DETAILS)}
      >
        DETAILS
      </a>
      {
        numOfRegistrants ? (
          <a
            tabIndex="0"
            role="tab"
            aria-selected={selectedView === DETAIL_TABS.REGISTRANTS}
            onClick={(e) => {
              handleSelectorClicked(e, DETAIL_TABS.REGISTRANTS);
            }}
            onKeyPress={(e) => {
              handleSelectorClicked(e, DETAIL_TABS.REGISTRANTS);
            }}
            styleName={getSelectorStyle(selectedView, DETAIL_TABS.REGISTRANTS)}
          >
            REGISTRANTS
            <span styleName="num">{numOfRegistrants}</span>
          </a>
        ) : null
      }
      {
        isDesign && checkpointCount > 0
        && (
        <a
          tabIndex="0"
          role="tab"
          aria-selected={selectedView === DETAIL_TABS.CHECKPOINTS}
          onClick={(e) => { handleSelectorClicked(e, DETAIL_TABS.CHECKPOINTS); }}
          onKeyPress={(e) => { handleSelectorClicked(e, DETAIL_TABS.CHECKPOINTS); }}
          styleName={getSelectorStyle(selectedView, DETAIL_TABS.CHECKPOINTS)}
        >
          CHECKPOINTS
          <span styleName="num">{checkpointCount}</span>
        </a>
        )
      }
      {
        (numOfSub && isLoggedIn) ? (
          <a
            tabIndex="0"
            role="tab"
            aria-selected={selectedView === DETAIL_TABS.SUBMISSIONS}
            onClick={(e) => { handleSelectorClicked(e, DETAIL_TABS.SUBMISSIONS); }}
            onKeyPress={(e) => { handleSelectorClicked(e, DETAIL_TABS.SUBMISSIONS); }}
            styleName={getSelectorStyle(selectedView, DETAIL_TABS.SUBMISSIONS)}
          >
            SUBMISSIONS
            <span styleName="num">{numOfSub}</span>
          </a>
        ) : null
      }
      {
        (hasRegistered && isMM && mySubmissions) ? (
          <a
            tabIndex="0"
            role="tab"
            aria-selected={selectedView === DETAIL_TABS.MY_SUBMISSIONS}
            onClick={(e) => { handleSelectorClicked(e, DETAIL_TABS.MY_SUBMISSIONS); }}
            onKeyPress={(e) => { handleSelectorClicked(e, DETAIL_TABS.MY_SUBMISSIONS); }}
            styleName={getSelectorStyle(selectedView, DETAIL_TABS.MY_SUBMISSIONS)}
          >
            MY SUBMISSIONS
            <span styleName="num">{mySubmissions.length}</span>
          </a>
        ) : null
      }
      {
        (hasRegistered && !isMM && mySubmissions && mySubmissions.length > 0) && (
          <Link
            to={`/challenges/${challenge.id}/my-submissions`}
            styleName="challenge-selector-common challenge-unselected-view"
          >
            MY SUBMISSIONS
          </Link>
        )
      }
      {
        numWinners ? (
          <a
            tabIndex="0"
            role="tab"
            aria-selected={selectedView === DETAIL_TABS.WINNERS}
            onClick={(e) => { handleSelectorClicked(e, DETAIL_TABS.WINNERS); }}
            onKeyPress={(e) => { handleSelectorClicked(e, DETAIL_TABS.WINNERS); }}
            styleName={getSelectorStyle(selectedView, DETAIL_TABS.WINNERS)}
          >
            WINNERS
            <span styleName="num">{numWinners}</span>
          </a>
        ) : null
      }
      { (() => {
        if (hasRegistered || Boolean(roles.length)) {
          if (!_.isEmpty(discuss)) {
            return (
              discuss.map(d => (
                <a
                  href={d.url}
                  styleName={getSelectorStyle(selectedView, DETAIL_TABS.CHALLENGE_FORUM)}
                  target="_blank"
                  rel="oopener noreferrer"
                >
                  CHALLENGE DISCUSSION
                </a>
              ))
            );
          }
          if (forumId > 0) {
            return (
              <a
                href={`${config.URL.FORUMS}${forumEndpoint}`}
                styleName={getSelectorStyle(selectedView, DETAIL_TABS.CHALLENGE_FORUM)}
                target="_blank"
                rel="oopener noreferrer"
              >
                CHALLENGE FORUM
              </a>
            );
          }
        }
        return '';
      })()}
      {
        (challenge.track.toLowerCase() === 'data science' && showDashboard) && (
          <a
            tabIndex="0"
            role="tab"
            aria-selected={selectedView === DETAIL_TABS.MM_DASHBOARD}
            onClick={(e) => { handleSelectorClicked(e, DETAIL_TABS.MM_DASHBOARD); }}
            onKeyPress={(e) => { handleSelectorClicked(e, DETAIL_TABS.MM_DASHBOARD); }}
            styleName={getSelectorStyle(selectedView, DETAIL_TABS.MM_DASHBOARD)}
          >
            DASHBOARD
          </a>
        )
      }
    </React.Fragment>
  );

  const isSubmissionTabSelected = (isDesign && !(challenge.submissionViewable === 'true')) ? currentSelected === DETAIL_TABS.REGISTRANTS
    : currentSelected === DETAIL_TABS.SUBMISSIONS
  || currentSelected === DETAIL_TABS.REGISTRANTS
  || currentSelected === DETAIL_TABS.MY_SUBMISSIONS;

  return (
    <div
      styleName="container"
      onScroll={handleScroll}
    >
      {
        !desktop && (
          <div styleName="mobile-wrapper">
            <div styleName="challenge-view-selector-mobile">
              <div
                styleName="mobile-tab-container"
                role="presentation"
                onClick={() => setIsTabClosed(!isTabClosed)}
              >
                <div styleName="mobile-tab-left-content">
                  <p styleName="title">{currentSelected}</p>
                  {
                    currentSelected === DETAIL_TABS.REGISTRANTS && numOfRegistrants && (
                      <span styleName="mobile-tab-num">{numOfRegistrants}</span>
                    )
                  }
                  {
                    currentSelected === DETAIL_TABS.SUBMISSIONS && numOfSub && isLoggedIn && (
                      <span styleName="mobile-tab-num">{numOfSub}</span>
                    )
                  }
                  {
                    currentSelected === DETAIL_TABS.MY_SUBMISSIONS && hasRegistered
                    && isMM && mySubmissions && (
                      <span styleName="mobile-tab-num">{mySubmissions.length}</span>
                    )
                  }
                  {
                    currentSelected === DETAIL_TABS.WINNERS && numWinners
                    && (
                      <span styleName="mobile-tab-num">{numWinners}</span>
                    )
                  }
                </div>
                <div
                  role="presentation"
                  styleName={cn('icon', { down: !isTabClosed })}
                  onClick={() => setIsTabClosed(!isTabClosed)}
                >
                  <ArrowIcon />
                </div>
              </div>
              {
          !isTabClosed && (
            <div styleName="mobile-tab-expanded">
              {tabDetail}
            </div>
          )
        }
            </div>
            {
              isSubmissionTabSelected && !viewAsTable && (
                <div
                  styleName="mobile-sort-icon"
                  role="button"
                  tabIndex={0}
                  onClick={() => setExpanded(!expanded)}
                >
                  <SortIcon />
                </div>
              )
            }
            {
              expanded && (
                <div styleName="sort-overlay">
                  <div styleName="sort-header">
                    <p>SORT</p>
                    <div role="button" onClick={() => setExpanded(false)} tabIndex={0}>
                      <CloseIcon />
                    </div>
                  </div>
                  <div styleName="sort-body">
                    {
                      sortOptions.map(option => (
                        <div
                          key={`sort-option-${option.name}`}
                          styleName="sort-item"
                          onClick={() => {
                            setSelectedSortOption(option.name);
                            onSort(currentSelected, option);
                            setExpanded(false);
                          }}
                        >
                          <span styleName={`${option.name === selectedSortOption ? 'bold' : ''}`}>{option.name}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )
            }
          </div>
        )
      }
      {
        desktop && (
          <div styleName="challenge-view-selector">
            {tabDetail}
          </div>
        )
      }
    </div>
  );
}

ChallengeViewSelector.defaultProps = {
  isLoggedIn: false,
  challenge: {},
  isMM: false,
  checkpointCount: 0,
  numOfRegistrants: 0,
  numOfCheckpointSubmissions: 0,
  numOfSubmissions: 0,
};

ChallengeViewSelector.propTypes = {
  isLoggedIn: PT.bool,
  challenge: PT.shape({
    id: PT.string,
    legacyId: PT.string,
    legacy: PT.shape({
      forumId: PT.number,
    }),
    userDetails: PT.shape({
      roles: PT.arrayOf(PT.string),
    }),
    type: PT.string,
    track: PT.string,
    tags: PT.arrayOf(PT.shape()),
    metadata: PT.arrayOf(PT.string),
    submissionViewable: PT.string,
  }),
  isMM: PT.bool,
  checkpointCount: PT.number,
  numOfRegistrants: PT.number,
  numOfCheckpointSubmissions: PT.number,
  numOfSubmissions: PT.number,
  numWinners: PT.number.isRequired,
  onSelectorClicked: PT.func.isRequired,
  selectedView: PT.string.isRequired,
  trackLower: PT.string.isRequired,
  hasRegistered: PT.bool.isRequired,
  mySubmissions: PT.arrayOf(PT.shape()).isRequired,
  onSort: PT.func.isRequired,
  viewAsTable: PT.bool.isRequired,
};
