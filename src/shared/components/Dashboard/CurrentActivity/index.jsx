/* eslint jsx-a11y/no-noninteractive-element-interactions:0 */

import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import { TABS } from 'actions/page/dashboard';

import * as Filter from 'utils/challenge-listing/filter';

import Challenges from './Challenges';
import Communities from './Communities';
import Header from './Header';
import Srms from './Srms';

import './styles.scss';

export default class MyChallenges extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      viewMode: 'tile',
      selectedCommunityId: '',
      showMyCommunityOnly: false,
    };
    this.setViewMode = this.setViewMode.bind(this);
    this.setTab = this.setTab.bind(this);
    this.selectCommunity = this.selectCommunity.bind(this);
  }

  setViewMode(viewMode) {
    this.setState({
      viewMode,
    });
  }

  setTab(activeTab) {
    this.setState({
      activeTab,
    });
  }

  selectCommunity(id) {
    this.setState({
      selectedCommunityId: id,
    });
  }

  render() {
    const {
      challengeFilter,
      challenges,
      challengesLoading,
      communities,
      communitiesLoading,
      communityStats,
      selectChallengeDetailsTab,
      setChallengeListingFilter,
      showChallengeFilter,
      srms,
      srmsLoading,
      switchChallengeFilter,
      switchShowChallengeFilter,
      switchTab,
      tab,
      unregisterFromChallenge,
      userGroups,
    } = this.props;

    const myCommunities = communities.filter(x =>
      _.intersection(userGroups, x.groupIds).length)
      .map((community) => {
        const filter = Filter.getFilterFunction(community.challengeFilter);
        const res = _.clone(community);
        res.number = challenges.filter(x => filter(x)).length;
        return res;
      });

    return (
      <div styleName="container">
        <Header
          numChallenges={challenges.length}
          numCommunities={myCommunities.length}
          switchTab={switchTab}
          tab={tab}
        />
        {
          tab === TABS.MY_ACTIVE_CHALLENGES ? (
            <Challenges
              challengeFilter={challengeFilter}
              challenges={challenges}
              challengesLoading={challengesLoading}
              communities={[{
                communityId: '',
                communityName: 'All communities',
                number: challenges.length,
              }].concat(myCommunities)}
              communitiesLoading={communitiesLoading}
              selectChallengeDetailsTab={selectChallengeDetailsTab}
              setChallengeListingFilter={setChallengeListingFilter}
              showChallengeFilter={showChallengeFilter}
              switchChallengeFilter={switchChallengeFilter}
              switchShowChallengeFilter={switchShowChallengeFilter}
              unregisterFromChallenge={unregisterFromChallenge}
            />
          ) : null
        }
        {
          tab === TABS.COMMUNITIES ? (
            <Communities
              communities={myCommunities}
              communitiesLoading={communitiesLoading}
              communityStats={communityStats}
              userGroups={userGroups}
            />
          ) : null
        }
        {
          tab === TABS.SRMS ? (
            <Srms
              srms={srms}
              srmsLoading={srmsLoading}
            />
          ) : null
        }
      </div>
    );
  }
}

MyChallenges.propTypes = {
  challengeFilter: PT.string.isRequired,
  challenges: PT.arrayOf(PT.object).isRequired,
  challengesLoading: PT.bool.isRequired,
  communities: PT.arrayOf(PT.object).isRequired,
  communitiesLoading: PT.bool.isRequired,
  communityStats: PT.shape().isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
  setChallengeListingFilter: PT.func.isRequired,
  showChallengeFilter: PT.bool.isRequired,
  srms: PT.arrayOf(PT.object).isRequired,
  srmsLoading: PT.bool.isRequired,
  switchChallengeFilter: PT.func.isRequired,
  switchShowChallengeFilter: PT.func.isRequired,
  switchTab: PT.func.isRequired,
  tab: PT.oneOf(_.values(TABS)).isRequired,
  unregisterFromChallenge: PT.func.isRequired,
  userGroups: PT.arrayOf(PT.object).isRequired,
};
