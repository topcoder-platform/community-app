import React, { useEffect, useState, useMemo } from 'react';
import _ from 'lodash';
import { BUCKETS, isPastBucket } from 'utils/challenge-listing/buckets';
import cn from 'classnames';
import { useMediaQuery } from 'react-responsive';
import ArrowIcon from 'assets/images/ico-arrow-down.svg';
import PT from 'prop-types';

import './style.scss';

const TAB_NAME = {
  INNOVATION_CHALLENGE: 'Innovation Challenges',
  PAST_CHALLENGES: 'Past',
  ACTIVE_CHALLENGES: 'Active',
};

const ChallengeTab = ({
  activeBucket,
  setPreviousBucketOfActiveTab,
  setPreviousBucketOfPastChallengesTab,
  previousBucketOfPastChallengesTab,
  previousBucketOfActiveTab,
  selectBucket,
  location,
  setFilterState,
  filterState,
}) => {
  const past = isPastBucket(activeBucket);
  const [currentSelected, setCurrentSelected] = useState(past);
  const [isTabClosed, setIsTabClosed] = useState(true);
  const currentTabName = useMemo(() => {
    if (filterState.isInnovationChallenge === 'true') {
      return TAB_NAME.INNOVATION_CHALLENGE;
    }
    return currentSelected ? TAB_NAME.PAST_CHALLENGES : TAB_NAME.ACTIVE_CHALLENGES;
  }, [location, currentSelected, filterState]);

  useEffect(() => {
    setCurrentSelected(isPastBucket(activeBucket));
  }, [activeBucket]);

  const onActiveClick = () => {
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

  const onInnovationClick = () => {
    if (currentTabName === TAB_NAME.INNOVATION_CHALLENGE) {
      return;
    }
    if (!past) {
      setPreviousBucketOfActiveTab(activeBucket);
    } else {
      setPreviousBucketOfPastChallengesTab(activeBucket);
    }
    setFilterState({
      ..._.cloneDeep(filterState),
      isInnovationChallenge: 'true',
    });
    selectBucket(BUCKETS.OPEN_FOR_REGISTRATION);
  };

  const onPastChallengesClick = () => {
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
        key="tab-item-innovation"
        styleName={cn('item', { active: currentTabName === TAB_NAME.INNOVATION_CHALLENGE })}
        onClick={onInnovationClick}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') {
            return;
          }
          onInnovationClick();
        }}
        role="presentation"
      >
        {TAB_NAME.INNOVATION_CHALLENGE}
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
              onClick={onInnovationClick}
              styleName={cn('item', { active: currentTabName === TAB_NAME.INNOVATION_CHALLENGE })}
            >
              <p>{TAB_NAME.INNOVATION_CHALLENGE}</p>
            </div>
            <div
              role="presentation"
              styleName={cn('item', { active: currentTabName === TAB_NAME.PAST_CHALLENGES })}
              onClick={onPastChallengesClick}
            >
              <p>{TAB_NAME.PAST_CHALLENGES}</p>
            </div>
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
};

ChallengeTab.propTypes = {
  location: PT.shape({
    search: PT.string,
    pathname: PT.string,
  }).isRequired,
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
