import React, { useEffect, useState, useMemo } from 'react';
import _ from 'lodash';
import { BUCKETS, isPastBucket } from 'utils/challenge-listing/buckets';
import cn from 'classnames';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'topcoder-react-utils';
import ArrowIcon from 'assets/images/ico-arrow-down.svg';
import PT from 'prop-types';

import './style.scss';

const TAB_NAME = {
  PAST_CHALLENGES: 'Past Challenges',
  ACTIVE_CHALLENGES: 'Active Challenges',
};

const TAB_LINKS = [
  {
    label: 'Engagements',
    to: '/engagements',
  },
];

const ChallengeTab = ({
  activeBucket,
  setPreviousBucketOfActiveTab,
  setPreviousBucketOfPastChallengesTab,
  previousBucketOfPastChallengesTab,
  previousBucketOfActiveTab,
  selectBucket,
  location,
  history,
  setFilterState,
  filterState,
}) => {
  const past = isPastBucket(activeBucket);
  const [currentSelected, setCurrentSelected] = useState(past);
  const [isTabClosed, setIsTabClosed] = useState(true);
  const pathname = _.get(location, 'pathname', '');
  const activeExternalTab = useMemo(
    () => TAB_LINKS.find(link => pathname.startsWith(link.to)),
    [pathname],
  );
  const externalTabLabel = activeExternalTab ? activeExternalTab.label : null;
  const currentTabName = useMemo(
    () => (
      externalTabLabel
      || (currentSelected ? TAB_NAME.PAST_CHALLENGES : TAB_NAME.ACTIVE_CHALLENGES)
    ),
    [currentSelected, externalTabLabel],
  );

  useEffect(() => {
    setCurrentSelected(isPastBucket(activeBucket));
  }, [activeBucket]);

  const onActiveClick = () => {
    if (externalTabLabel) {
      if (history && history.push) {
        history.push(`/challenges?bucket=${BUCKETS.OPEN_FOR_REGISTRATION}`);
      }
      return;
    }
    if (currentTabName === TAB_NAME.ACTIVE_CHALLENGES) {
      return;
    }
    if (past) {
      setPreviousBucketOfPastChallengesTab(activeBucket);
    }
    setCurrentSelected(0);
    setIsTabClosed(true);
    let selectedBucket = '';
    if (previousBucketOfActiveTab) {
      selectedBucket = previousBucketOfActiveTab;
    } else {
      selectedBucket = BUCKETS.OPEN_FOR_REGISTRATION;
    }
    selectBucket(selectedBucket);
    if (filterState.isInnovationChallenge === 'true') {
      setFilterState({
        ..._.cloneDeep(filterState),
        isInnovationChallenge: undefined,
      });
    }
  };

  const onPastChallengesClick = () => {
    if (externalTabLabel) {
      if (history && history.push) {
        history.push(`/challenges?bucket=${BUCKETS.ALL_PAST}`);
      }
      return;
    }
    if (currentTabName === TAB_NAME.PAST_CHALLENGES) {
      return;
    }
    if (!past) {
      setPreviousBucketOfActiveTab(activeBucket);
    }
    setCurrentSelected(1);
    setIsTabClosed(true);
    let selectedBucket = '';
    if (previousBucketOfPastChallengesTab) {
      selectedBucket = previousBucketOfPastChallengesTab;
    } else {
      selectedBucket = BUCKETS.ALL_PAST;
    }
    selectBucket(selectedBucket);
    if (filterState.isInnovationChallenge === 'true') {
      setFilterState({
        ..._.cloneDeep(filterState),
        isInnovationChallenge: undefined,
      });
    }
  };

  const desktop = useMediaQuery({ minWidth: 1024 });

  const desktopTab = (
    <ul styleName="challenge-tab">
      <li
        key="tab-item-active"
        styleName={cn('item', { active: currentTabName === TAB_NAME.ACTIVE_CHALLENGES })}
        onClick={onActiveClick}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') {
            return;
          }
          onActiveClick();
        }}
        role="presentation"
      >
        {TAB_NAME.ACTIVE_CHALLENGES}
      </li>
      <li
        key="tab-item-past"
        styleName={cn('item', { active: currentTabName === TAB_NAME.PAST_CHALLENGES })}
        onClick={onPastChallengesClick}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') {
            return;
          }
          onPastChallengesClick();
        }}
        role="presentation"
      >
        {TAB_NAME.PAST_CHALLENGES}
      </li>
      {TAB_LINKS.map(link => (
        <li
          key={`tab-item-${link.to}`}
          styleName={cn('item', { active: externalTabLabel === link.label })}
        >
          <Link styleName="item-link" to={link.to}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  const mobileTab = (
    <React.Fragment>
      <div
        styleName="mobile-tab-container"
        role="presentation"
        onClick={() => setIsTabClosed(!isTabClosed)}
      >
        <p styleName="title">{currentTabName}</p>
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
            <div
              role="presentation"
              onClick={onActiveClick}
              styleName={cn('item', { active: currentTabName === TAB_NAME.ACTIVE_CHALLENGES })}
            >
              <p>{TAB_NAME.ACTIVE_CHALLENGES}</p>
            </div>
            <div
              role="presentation"
              styleName={cn('item', { active: currentTabName === TAB_NAME.PAST_CHALLENGES })}
              onClick={onPastChallengesClick}
            >
              <p>{TAB_NAME.PAST_CHALLENGES}</p>
            </div>
            {TAB_LINKS.map(link => (
              <Link
                key={`tab-item-${link.to}`}
                styleName={cn('item', 'item-link', { active: externalTabLabel === link.label })}
                to={link.to}
              >
                <p>{link.label}</p>
              </Link>
            ))}
          </div>
        )
      }
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <h1 styleName="tc-title">Opportunities</h1>
      {desktop ? desktopTab : mobileTab}
    </React.Fragment>
  );
};

ChallengeTab.defaultProps = {
  activeBucket: null,
  selectBucket: () => {},
  setFilterState: () => {},
  filterState: {},
  setPreviousBucketOfActiveTab: () => {},
  setPreviousBucketOfPastChallengesTab: () => {},
  previousBucketOfActiveTab: null,
  previousBucketOfPastChallengesTab: null,
  history: null,
};

ChallengeTab.propTypes = {
  location: PT.shape({
    search: PT.string,
    pathname: PT.string,
  }).isRequired,
  history: PT.shape({
    push: PT.func,
  }),
  activeBucket: PT.string,
  setPreviousBucketOfActiveTab: PT.func,
  setPreviousBucketOfPastChallengesTab: PT.func,
  previousBucketOfActiveTab: PT.string,
  selectBucket: PT.func,
  previousBucketOfPastChallengesTab: PT.string,
  setFilterState: PT.func,
  filterState: PT.shape(),
};

export default ChallengeTab;
