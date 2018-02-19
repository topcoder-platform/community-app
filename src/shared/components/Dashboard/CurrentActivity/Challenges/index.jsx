import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';

import ChallengeCard from './ChallengeCard';
import './style.scss';

export default function Challenges({
  challenges,
  challengesLoading,
  selectChallengeDetailsTab,
  setChallengeListingFilter,
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
      {
        challengesLoading ? <LoadingIndicator /> : challenges.map(item => (
          <ChallengeCard
            challenge={item}
            selectChallengeDetailsTab={selectChallengeDetailsTab}
            setChallengeListingFilter={setChallengeListingFilter}
            unregisterFromChallenge={unregisterFromChallenge}
          />
        ))
      }
    </div>
  );
}

Challenges.propTypes = {
  challenges: PT.arrayOf(PT.object).isRequired,
  challengesLoading: PT.bool.isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
  setChallengeListingFilter: PT.func.isRequired,
  unregisterFromChallenge: PT.func.isRequired,
};
