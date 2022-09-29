import React, { useEffect, useState } from 'react';
import { BUCKETS, isPastBucket } from 'utils/challenge-listing/buckets';
import cn from 'classnames';
import { useMediaQuery } from 'react-responsive';
import ArrowIcon from 'assets/images/ico-arrow-down.svg';
import PT from 'prop-types';

import './style.scss';

const ChallengeTab = ({
  activeBucket,
  setPreviousBucketOfActiveTab,
  setPreviousBucketOfPastChallengesTab,
  previousBucketOfPastChallengesTab,
  previousBucketOfActiveTab,
  selectBucket,
}) => {
  const past = isPastBucket(activeBucket);
  const [currentSelected, setCurrentSelected] = useState(past);
  const [isTabClosed, setIsTabClosed] = useState(true);

  useEffect(() => {
    setCurrentSelected(isPastBucket(activeBucket));
  }, [activeBucket]);

  const onActiveClick = () => {
    if (!past) {
      return;
    }
    setPreviousBucketOfPastChallengesTab(activeBucket);
    setCurrentSelected(0);
    setIsTabClosed(true);
    if (previousBucketOfActiveTab) {
      selectBucket(previousBucketOfActiveTab);
    } else {
      selectBucket(BUCKETS.OPEN_FOR_REGISTRATION);
    }
  };

  const onPastChallengesClick = () => {
    if (past) {
      return;
    }
    setPreviousBucketOfActiveTab(activeBucket);
    setCurrentSelected(1);
    setIsTabClosed(true);
    if (previousBucketOfPastChallengesTab) {
      selectBucket(previousBucketOfPastChallengesTab);
    } else {
      selectBucket(BUCKETS.ALL_PAST);
    }
  };

  const desktop = useMediaQuery({ minWidth: 1024 });

  const desktopTab = (
    <ul styleName="challenge-tab">
      <li
        key="tab-item-active"
        styleName={cn('item', { active: !currentSelected })}
        onClick={onActiveClick}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') {
            return;
          }
          onActiveClick();
        }}
        role="presentation"
      >
        ACTIVE
      </li>
      <li
        key="tab-item-past"
        styleName={cn('item', { active: currentSelected })}
        onClick={onPastChallengesClick}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') {
            return;
          }
          onPastChallengesClick();
        }}
        role="presentation"
      >
        PAST
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
        <p styleName="title">{currentSelected ? 'PAST' : 'ACTIVE'}</p>
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
              styleName={cn('item', { active: !currentSelected })}
            >
              <p>ACTIVE</p>
            </div>
            <div
              role="presentation"
              styleName={cn('item', { active: currentSelected })}
              onClick={onPastChallengesClick}
            >
              <p>PAST</p>
            </div>
          </div>
        )
      }
    </React.Fragment>
  );

  return desktop ? desktopTab : mobileTab;
};

ChallengeTab.defaultProps = {
  setPreviousBucketOfActiveTab: () => {},
  setPreviousBucketOfPastChallengesTab: () => {},
  previousBucketOfActiveTab: null,
  previousBucketOfPastChallengesTab: null,
};

ChallengeTab.propTypes = {
  activeBucket: PT.string.isRequired,
  setPreviousBucketOfActiveTab: PT.func,
  setPreviousBucketOfPastChallengesTab: PT.func,
  previousBucketOfActiveTab: PT.string,
  selectBucket: PT.func.isRequired,
  previousBucketOfPastChallengesTab: PT.string,
};

export default ChallengeTab;
