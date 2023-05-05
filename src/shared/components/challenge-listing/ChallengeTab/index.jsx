import React, { useEffect, useState, useMemo } from 'react';
import { BUCKETS, isPastBucket } from 'utils/challenge-listing/buckets';
import cn from 'classnames';
import { useMediaQuery } from 'react-responsive';
import ArrowIcon from 'assets/images/ico-arrow-down.svg';
import { config } from 'topcoder-react-utils';
import PT from 'prop-types';

import './style.scss';
import { getUpdateQuery } from 'utils/url';

const ChallengeTab = ({
  activeBucket,
  setPreviousBucketOfActiveTab,
  setPreviousBucketOfPastChallengesTab,
  previousBucketOfPastChallengesTab,
  previousBucketOfActiveTab,
  selectBucket,
  location,
  history,
}) => {
  const past = isPastBucket(activeBucket);
  const [currentSelected, setCurrentSelected] = useState(past);
  const [isTabClosed, setIsTabClosed] = useState(true);
  const currentTabName = useMemo(() => {
    if (location.pathname === config.GIGS_PAGES_PATH) {
      return 'GIGS';
    }
    return currentSelected ? 'PAST CHALLENGES' : 'ACTIVE CHALLENGES';
  }, [location, currentSelected]);
  const pageTitle = useMemo(() => {
    if (location.pathname === config.GIGS_PAGES_PATH) {
      return 'GIG WORK OPPORTUNITIES';
    }
    return 'CHALLENGES';
  }, [location]);

  useEffect(() => {
    setCurrentSelected(isPastBucket(activeBucket));
  }, [activeBucket]);

  const moveToChallengesPage = (selectedBucket) => {
    if (currentTabName === 'GIGS') {
      const queryParams = getUpdateQuery({ bucket: selectedBucket });
      history.push(`/challenges${queryParams || ''}`);
    }
  };

  const onActiveClick = () => {
    if (!past && currentTabName !== 'GIGS') {
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
    moveToChallengesPage(selectedBucket);
    selectBucket(selectedBucket);
  };

  const onPastChallengesClick = () => {
    if (past && currentTabName !== 'GIGS') {
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
    moveToChallengesPage(selectedBucket);
    selectBucket(selectedBucket);
  };

  const onGigsClick = () => {
    if (typeof window === 'undefined') {
      return;
    }
    history.push(`${config.GIGS_PAGES_PATH}${window.location.search || ''}`);
  };

  const desktop = useMediaQuery({ minWidth: 1024 });

  const desktopTab = (
    <ul styleName="challenge-tab">
      <li
        key="tab-item-active"
        styleName={cn('item', { active: currentTabName === 'ACTIVE CHALLENGES' })}
        onClick={onActiveClick}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') {
            return;
          }
          onActiveClick();
        }}
        role="presentation"
      >
        ACTIVE CHALLENGES
      </li>
      <li
        key="tab-item-past"
        styleName={cn('item', { active: currentTabName === 'PAST CHALLENGES' })}
        onClick={onPastChallengesClick}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') {
            return;
          }
          onPastChallengesClick();
        }}
        role="presentation"
      >
        PAST CHALLENGES
      </li>
      <li
        key="tab-item-gigs"
        styleName={cn('item', { active: currentTabName === 'GIGS' })}
        onClick={onGigsClick}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') {
            return;
          }
          onGigsClick();
        }}
        role="presentation"
      >
        GIGS
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
              styleName={cn('item', { active: currentTabName === 'ACTIVE CHALLENGES' })}
            >
              <p>ACTIVE CHALLENGES</p>
            </div>
            <div
              role="presentation"
              styleName={cn('item', { active: currentTabName === 'PAST CHALLENGES' })}
              onClick={onPastChallengesClick}
            >
              <p>PAST CHALLENGES</p>
            </div>
            <div
              role="presentation"
              styleName={cn('item', { active: currentTabName === 'GIGS' })}
              onClick={onGigsClick}
            >
              <p>GIGS</p>
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
};

export default ChallengeTab;
