import React, { useEffect, useState, useMemo } from 'react';
import _ from 'lodash';
import { BUCKETS, isPastBucket } from 'utils/challenge-listing/buckets';
import cn from 'classnames';
import { useMediaQuery } from 'react-responsive';
import ArrowIcon from 'assets/images/ico-arrow-down.svg';
import { config } from 'topcoder-react-utils';
import PT from 'prop-types';

import './style.scss';
import { getUpdateQuery } from 'utils/url';

const TAB_NAME = {
  INNOVATION_CHALLENGE: 'INNOVATION CHALLENGE',
  PAST_CHALLENGES: 'PAST CHALLENGES',
  ACTIVE_CHALLENGES: 'ACTIVE CHALLENGES',
  GIGS: 'GIGS',
};

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
  const currentTabName = useMemo(() => {
    if (location.pathname && location.pathname.indexOf(config.GIGS_PAGES_PATH) >= 0) {
      return TAB_NAME.GIGS;
    }
    if (filterState.isInnovationChallenge === 'true') {
      return TAB_NAME.INNOVATION_CHALLENGE;
    }
    return currentSelected ? TAB_NAME.PAST_CHALLENGES : TAB_NAME.ACTIVE_CHALLENGES;
  }, [location, currentSelected, filterState]);
  const pageTitle = useMemo(() => {
    if (location.pathname && location.pathname.indexOf(config.GIGS_PAGES_PATH) >= 0) {
      return 'GIG WORK OPPORTUNITIES';
    }
    return 'CHALLENGES';
  }, [location]);

  useEffect(() => {
    setCurrentSelected(isPastBucket(activeBucket));
  }, [activeBucket]);

  const moveToChallengesPage = (selectedBucket, targetTabName) => {
    if (currentTabName === TAB_NAME.GIGS) {
      const params = { bucket: selectedBucket };
      if (targetTabName === TAB_NAME.INNOVATION_CHALLENGE) {
        params.isInnovationChallenge = 'true';
      }
      const queryParams = getUpdateQuery(params);
      history.push(`/challenges${queryParams || ''}`);
    }
  };

  const onActiveClick = () => {
    if (currentTabName === TAB_NAME.ACTIVE_CHALLENGES) {
      return;
    }
    setPreviousBucketOfPastChallengesTab(activeBucket);
    setCurrentSelected(0);
    setIsTabClosed(true);
    let selectedBucket = '';
    if (previousBucketOfActiveTab) {
      selectedBucket = previousBucketOfActiveTab;
    } else {
      selectedBucket = BUCKETS.OPEN_FOR_REGISTRATION;
    }
    moveToChallengesPage(selectedBucket, TAB_NAME.ACTIVE_CHALLENGES);
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
    setFilterState({
      ..._.cloneDeep(filterState),
      isInnovationChallenge: 'true',
    });
    moveToChallengesPage(BUCKETS.OPEN_FOR_REGISTRATION, TAB_NAME.INNOVATION_CHALLENGE);
  };

  const onPastChallengesClick = () => {
    if (currentTabName === TAB_NAME.PAST_CHALLENGES) {
      return;
    }
    setPreviousBucketOfActiveTab(activeBucket);
    setCurrentSelected(1);
    setIsTabClosed(true);
    let selectedBucket = '';
    if (previousBucketOfPastChallengesTab) {
      selectedBucket = previousBucketOfPastChallengesTab;
    } else {
      selectedBucket = BUCKETS.ALL_PAST;
    }
    moveToChallengesPage(selectedBucket, TAB_NAME.PAST_CHALLENGES);
    selectBucket(selectedBucket);
    if (filterState.isInnovationChallenge === 'true') {
      setFilterState({
        ..._.cloneDeep(filterState),
        isInnovationChallenge: undefined,
      });
    }
  };

  const onGigsClick = () => {
    if (typeof window === 'undefined') {
      return;
    }
    history.push(config.GIGS_PAGES_PATH);
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
      <li
        key="tab-item-gigs"
        styleName={cn('item', { active: currentTabName === TAB_NAME.GIGS })}
        onClick={onGigsClick}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') {
            return;
          }
          onGigsClick();
        }}
        role="presentation"
      >
        {TAB_NAME.GIGS}
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
            <div
              role="presentation"
              styleName={cn('item', { active: currentTabName === TAB_NAME.GIGS })}
              onClick={onGigsClick}
            >
              <p>{TAB_NAME.GIGS}</p>
            </div>
          </div>
        )
      }
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <h1 styleName="tc-title">{pageTitle}</h1>
      <hr styleName="tc-seperator" />
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
  history: PT.shape().isRequired,
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
