/* eslint jsx-a11y/no-noninteractive-element-interactions:0 */

import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import Sticky from 'react-stickynode';
import { TABS } from 'actions/page/dashboard';

import SwitchWithLabel from 'components/SwitchWithLabel';
import config from 'utils/config';
import * as Filter from 'utils/challenge-listing/filter';

// import ChallengeTile from './ChallengeTile';
import ChallengeFilter from './ChallengeFilter';
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
      switchShowChallengeFilter,
      switchTab,
      tab,
      unregisterFromChallenge,
      userGroups,
    } = this.props;

    /*
    const communityId = this.state.selectedCommunityId;
    if (communityId) {
      challenges = _.filter(challenges, Filter.getFilterFunction(_.find(this.props.communityList, ['communityId', communityId]).challengeFilter));
    }

    const communityFilters = _.map(this.props.communityList, (c) => {
      const community = _.cloneDeep(c);
      const filterFunc = Filter.getFilterFunction(community.challengeFilter);
      community.number = _.filter(this.props.challenges, (ch) => {
        const result = filterFunc(ch);
        if (result && community.communityId) {
          // eslint-disable-next-line no-param-reassign
          ch.communityLabel = community.communityName;
        }
        return result;
      },
      ).length;
      return community;
    })1
    1;

    communityFilters.unshift({
      communityId: '',
      communityName: 'All communities',
      number: this.props.challenges.length,
    });*/

    return (
      <div styleName="container">
        <Header
          numChallenges={challenges.length}
          switchTab={switchTab}
          tab={tab}
        />
        {
          tab === TABS.MY_ACTIVE_CHALLENGES ? (
            <Challenges
              challenges={challenges}
              challengesLoading={challengesLoading}
              selectChallengeDetailsTab={selectChallengeDetailsTab}
              setChallengeListingFilter={setChallengeListingFilter}
              showChallengeFilter={showChallengeFilter}
              switchShowChallengeFilter={switchShowChallengeFilter}
              unregisterFromChallenge={unregisterFromChallenge}
            />
          ) : null
        }
        {
          tab === TABS.COMMUNITIES ? (
            <Communities
              communities={communities}
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
      
      {/*}
        <header>
          <div styleName="section-title">
            <h1
              styleName={this.state.activeTab === 0 ? 'active' : ''}
              onClick={() => this.setTab(0)}
            >
              My Challenges
            </h1>
            <h1
              styleName={this.state.activeTab === 1 ? 'active' : ''}
              onClick={() => this.setTab(1)}
            >
              My Communities
            </h1>
          </div>
          {
            /*
            this.state.activeTab === 0 &&
            <div styleName="challenge-view-toggle">
              <button
                styleName={
                  `tile ${this.state.viewMode === 'tile' ? 'disabled' : ''}`
                }
                onClick={() => this.setViewMode('tile')}
              >
                Grid
              </button>
              <button
                styleName={
                  `list ${this.state.viewMode === 'list' ? 'disabled' : ''}`
                }
                onClick={() => this.setViewMode('list')}
              >
                List
              </button>
            </div>
            */
          }
          {/*
            this.state.activeTab === 1 &&
            <div styleName="show-only">
              <SwitchWithLabel
                enabled={this.state.showMyCommunityOnly}
                labelBefore="Show my community only"
                onSwitch={on => this.setState({ showMyCommunityOnly: on })}
              />
            </div>
          }
        </header>
        {
          this.state.activeTab === 0 && this.props.challenges && this.props.challenges.length > 0 &&
          <section styleName={`hasChallenges ${this.state.viewMode === 'list' ? 'list-view-active' : ''}`}>
            <div styleName={`challenges ${this.state.viewMode}-view`}>
              <div styleName="items">
                {
                  challenges.length === 0 &&
                  <div styleName="no-challenges">
                    You don&apos;t participate in active challenges from this community now.
                  </div>
                }
                {
                  this.state.viewMode === 'list' && challenges.length > 0 &&
                  <div styleName="section-titles">
                    <div styleName="challenge-title">Challenges</div>
                    <div styleName="phase-title">Phase</div>
                    <div styleName="regs-subs-title">Registrations &amp; Submissions</div>
                  </div>
                }
                {
                  challenges.map(challenge => (
                    <ChallengeTile
                      key={challenge.id}
                      challenge={challenge}
                      viewMode={this.state.viewMode}
                    />
                  ))
                }
              </div>
              <div styleName="filter-wrapper" id="dashboard-sticky-filter-container">
                <Sticky top={20} bottomBoundary="#dashboard-sticky-filter-container">
                  <ChallengeFilter
                    communities={communityFilters}
                    selectedCommunityId={this.state.selectedCommunityId}
                    selectCommunity={this.selectCommunity}
                  />
                </Sticky>
              </div>
            </div>
          </section>
        }
        {
          this.state.activeTab === 1 &&
          <div styleName="communities-container">
            <section styleName="communities">
              {
                this.props.communityList.map(c => (
                  (!this.state.showMyCommunityOnly || this.isCommunityRegstered(c)) &&
                  <div key={c.communityId}>
                    <CommunityTile
                      community={c}
                      stats={this.props.stats.communities[c.communityId]}
                      registered={this.isCommunityRegstered(c)}
                    />
                  </div>
                ))
              }
            </section>
          </div>
        }
        {
          this.state.activeTab === 0 &&
          <div styleName="my-challenges-links">
            <a href={`${config.URL.BASE}/my-challenges/?status=completed`}>Past Challenges</a>
          </div>
        */}
      </div>
    );
  }
}

MyChallenges.propTypes = {
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
  switchShowChallengeFilter: PT.func.isRequired,
  switchTab: PT.func.isRequired,
  tab: PT.oneOf(_.values(TABS)).isRequired,
  unregisterFromChallenge: PT.func.isRequired,
  userGroups: PT.arrayOf(PT.object).isRequired,
};
