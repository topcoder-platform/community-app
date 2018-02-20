import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import Sticky from 'react-stickynode';

import ChallengeCard from './ChallengeCard';
import ChallengeFilter from '../ChallengeFilter';
import style from './style.scss';

export default function Challenges({
  challenges,
  challengesLoading,
  selectChallengeDetailsTab,
  setChallengeListingFilter,
  showChallengeFilter,
  switchShowChallengeFilter,
  unregisterFromChallenge,
}) {
  if (challengesLoading) {
    return (
      <div styleName="loading">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div styleName="container">
      <div styleName="challenges">
        {
          challenges.map(item => (
            <ChallengeCard
              challenge={item}
              key={item.id}
              selectChallengeDetailsTab={selectChallengeDetailsTab}
              setChallengeListingFilter={setChallengeListingFilter}
              unregisterFromChallenge={unregisterFromChallenge}
            />
          ))
        }
      </div>
      <Sticky
        bottomBoundary={`.${style.container}`}
        styleName="sticky"
      >
        <ChallengeFilter
          expand={switchShowChallengeFilter}
          expanded={showChallengeFilter}
        />
      </Sticky>
    </div>
  );
}

Challenges.propTypes = {
  challenges: PT.arrayOf(PT.object).isRequired,
  challengesLoading: PT.bool.isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
  setChallengeListingFilter: PT.func.isRequired,
  showChallengeFilter: PT.bool.isRequired,
  switchShowChallengeFilter: PT.func.isRequired,
  unregisterFromChallenge: PT.func.isRequired,
};
