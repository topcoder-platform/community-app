import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import moment from 'moment';
import PT from 'prop-types';
import React from 'react';
import Sticky from 'react-stickynode';
import { config, Link } from 'topcoder-react-utils';

import { filter as Filter } from 'topcoder-react-lib';

import ChallengeCard from './ChallengeCard';
import ChallengeFilter from '../ChallengeFilter';

import style from './style.scss';

export default function Challenges({
  challengeFilter,
  challenges,
  challengesLoading,
  communities,
  communitiesLoading,
  selectChallengeDetailsTab,
  setChallengeListingFilter,
  showChallengeFilter,
  switchChallengeFilter,
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

  let filteredChallenges = challenges;
  if (challengeFilter) {
    let filter = communities.find(x => x.communityId === challengeFilter);
    if (filter) {
      filter = Filter.getFilterFunction(filter.challengeFilter);
      filteredChallenges = challenges.filter(x => filter(x));
    }
  }

  const now = moment();
  filteredChallenges = _.clone(filteredChallenges);
  for (let i = 0; i < filteredChallenges.length; i += 1) {
    const ch = filteredChallenges[i];
    const nextPhase = ch.currentPhases && _.last(ch.currentPhases);
    if (nextPhase) {
      const deadlineEnd = moment(nextPhase.scheduledEndTime);
      ch.dashboardPriority = deadlineEnd.diff(now);
    } else if (moment(ch.registrationStartDate).isAfter(now)) {
      ch.dashboardPriority = moment(ch.registrationStartDate).diff(now);
    } else if (ch.status === 'COMPLETED') {
      ch.dashboardPriority = Number.MAX_VALUE;
    } else ch.dashboardPriority = -Number.MAX_VALUE;
  }
  filteredChallenges.sort((a, b) =>
    a.dashboardPriority - b.dashboardPriority);

  return (
    <div styleName="container">
      <div styleName="innerContainer">
        <div styleName="challenges">
          {
            filteredChallenges.length ? (
              filteredChallenges.map(item => (
                <ChallengeCard
                  challenge={item}
                  key={item.id}
                  selectChallengeDetailsTab={selectChallengeDetailsTab}
                  setChallengeListingFilter={setChallengeListingFilter}
                  unregisterFromChallenge={unregisterFromChallenge}
                />
              ))
            ) : (
              <div styleName="msg">
                {
                  challengeFilter ? (
                    'You have no active challenges in the selected community'
                  ) : (
                    <div>
                      <p>
                        You have no active challenges at this moment. What are
                        you interested&nbsp;in?
                        &zwnj;{
                          <Link
                            openNewTab
                            to={config.URL.ARENA}
                          >
                            Competitive Programming
                          </Link>
                        }?
                        &zwnj;{
                          <Link
                            openNewTab
                            to="/challenges?filter[tracks][datasci]=true"
                          >
                            Data Science
                          </Link>
                        }?
                        &zwnj;{
                          <Link
                            openNewTab
                            to="/challenges?filter[tracks][design]=true"
                          >
                            Design
                          </Link>
                        }?
                        &zwnj;{
                          <Link
                            openNewTab
                            to="/challenges?filter[tracks][develop]=true"
                          >
                            Software Development
                          </Link>
                        }?
                      </p>
                    </div>
                  )
                }
              </div>
            )
          }
        </div>
        <Sticky
          bottomBoundary={`.${style.innerContainer}`}
          styleName="sticky"
        >
          <ChallengeFilter
            challengeFilter={challengeFilter}
            communities={communities}
            communitiesLoading={communitiesLoading}
            expand={switchShowChallengeFilter}
            expanded={showChallengeFilter}
            switchChallengeFilter={switchChallengeFilter}
          />
        </Sticky>
      </div>
      <div styleName="linksContainer">
        <a
          href={`${config.URL.BASE}/my-challenges/?status=completed`}
          styleName="link"
        >Past Challenges
        </a>
      </div>
    </div>
  );
}

Challenges.propTypes = {
  challengeFilter: PT.string.isRequired,
  challenges: PT.arrayOf(PT.object).isRequired,
  challengesLoading: PT.bool.isRequired,
  communities: PT.arrayOf(PT.object).isRequired,
  communitiesLoading: PT.bool.isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
  setChallengeListingFilter: PT.func.isRequired,
  showChallengeFilter: PT.bool.isRequired,
  switchChallengeFilter: PT.func.isRequired,
  switchShowChallengeFilter: PT.func.isRequired,
  unregisterFromChallenge: PT.func.isRequired,
};
