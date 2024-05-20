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
          (challenges || []).map(challenge => (
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
                  {`$${_.sum(
                    challenge.prizeSets
                      .filter(set => set.type === 'placement')
                      .map(item => _.sum(item.prizes.map(prize => prize.value))),
                  ).toLocaleString()}`}
                </span>
              </div>
            </div>
          ))
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
