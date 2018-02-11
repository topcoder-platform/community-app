/**
 * Displays a few challenge cards and the link to challenge listing.
 */

import PT from 'prop-types';
import React from 'react';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import Card from './Card';

import './style.scss';

export default function ChallengesBlock({
  baseUrl,
  challenges,
  setChallengeListingFilter,
}) {
  return (
    <div styleName="container">
      <h1 styleName="title">Active Challenges</h1>
      <div styleName="list">
        {
          challenges.slice(0, 3).map(challenge => (
            <Card
              baseUrl={baseUrl}
              challenge={challenge}
              setChallengeListingFilter={setChallengeListingFilter}
            />
          ))
        }
      </div>
      <PrimaryButton
        to={`${baseUrl}/challenges`}
      >Browse all challenges</PrimaryButton>
    </div>
  );
}

ChallengesBlock.propTypes = {
  baseUrl: PT.string.isRequired,
  challenges: PT.arrayOf(PT.object).isRequired,
  setChallengeListingFilter: PT.func.isRequired,
};
