import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import qs from 'qs';

import { config } from 'topcoder-react-utils';

import './styles.scss';

export default function ChallengesFeed({
  challenges,
  loading,
  theme,
  title,
  challengeListingQuery,
}) {
  return challenges && challenges.length ? (
    <div styleName={`container ${theme}`}>
      <div styleName="header">
        <span styleName="title">{title}</span>
        <a
          styleName="allLink"
          href={`${config.URL.CHALLENGES_URL}${
            challengeListingQuery
              ? `?${qs.stringify(challengeListingQuery)}`
              : ''
          }`}
          target="_blank"
          rel="noreferrer"
        >
          View all
        </a>
      </div>
      <div styleName="challenges">
        {loading ? (
          <div styleName="loading">
            <LoadingIndicator />
          </div>
        ) : (
          (challenges || []).map((challenge) => {
            const placementPrizes = challenge.prizeSets
              .filter(set => set.type === 'PLACEMENT')
              .flatMap(item => item.prizes);
            const prizeTotal = _.sum(placementPrizes.map(prize => prize.value));
            const prizeType = placementPrizes.length > 0 ? placementPrizes[0].type : null;
            const isPointBasedPrize = prizeType === 'POINT';
            const prizeSymbol = isPointBasedPrize ? '' : '$';

            return (
              <div styleName="row" key={challenge.id}>
                <a
                  href={`/challenges/${challenge.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {challenge.name}
                </a>
                <div styleName="prize">
                  <span styleName="amount">
                    {`${prizeSymbol}${prizeTotal.toLocaleString()}`}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  ) : null;
}

ChallengesFeed.defaultProps = {
  challenges: [],
  theme: 'light',
  title: 'Opportunities',
  challengeListingQuery: undefined,
};

ChallengesFeed.propTypes = {
  challenges: PT.arrayOf(PT.shape()),
  loading: PT.bool.isRequired,
  theme: PT.oneOf(['dark', 'light']),
  title: PT.string,
  challengeListingQuery: PT.shape(),
};
