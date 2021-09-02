import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import { config } from 'topcoder-react-utils';

import './styles.scss';

export default function ChallengesFeed({
  challenges,
  loading,
  theme,
}) {
  const itemHeight = 41;

  return (
    <div styleName={`container ${theme}`}>
      <div styleName="header">
        <span styleName="title">CHALLENGES</span>
        <a
          styleName="allLink"
          href={`${config.URL.CHALLENGES_URL}`}
          target="_blank"
          rel="noreferrer"
        >View all <span>challenges</span>
        </a>
      </div>
      <Scrollbars autoHide styleName="challenges" style={{ height: itemHeight * 5, width: '100%' }}>
        {loading ? <div styleName="loading"><LoadingIndicator /></div>
          : challenges.map(challenge => (
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
                  {`$${_.sum(challenge.prizeSets
                    .map(item => _.sum(item.prizes.map(prize => prize.value))))}`}
                </span>
              </div>
            </div>
          ))}
      </Scrollbars>
    </div>
  );
}

ChallengesFeed.defaultProps = {
  challenges: [],
  theme: 'light',
};

ChallengesFeed.propTypes = {
  challenges: PT.arrayOf(PT.shape()),
  loading: PT.bool.isRequired,
  theme: PT.oneOf(['dark', 'light']),
};
