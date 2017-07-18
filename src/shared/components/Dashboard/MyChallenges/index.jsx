/* eslint jsx-a11y/no-noninteractive-element-interactions:0 */

import React from 'react';
import PT from 'prop-types';
import cn from 'classnames';
import _ from 'lodash';
import Sticky from 'react-stickynode';

import SwitchWithLabel from 'components/SwitchWithLabel';
import config from 'utils/config';
import * as Filter from 'utils/challenge-listing/filter';
import ChallengeTile from './ChallengeTile';
import ChallengeFilter from './ChallengeFilter';
import CommunityTile from './CommunityTile';
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
    this.isCommunityRegstered = this.isCommunityRegstered.bind(this);
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

  isCommunityRegstered(community) {
    return _.some(this.props.groups, g => g.id === community.groupId);
  }

  render() {
    let challenges = this.props.challenges;
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
    });

    communityFilters.unshift({
      communityId: '',
      communityName: 'All communities',
      number: this.props.challenges.length,
    });

    return (
      <div styleName="challenges">
        <header>
          <div styleName="section-title">
            <h1
              styleName={cn({ active: this.state.activeTab === 0 })}
              onClick={() => this.setTab(0)}
            >
              My Challenges
            </h1>
            <h1
              styleName={cn({ active: this.state.activeTab === 1 })}
              onClick={() => this.setTab(1)}
            >
              My Communities
            </h1>
          </div>
          {
            this.state.activeTab === 0 &&
            <div styleName="challenge-view-toggle">
              <button
                styleName={cn({ tile: true, disabled: this.state.viewMode === 'tile' })}
                onClick={() => this.setViewMode('tile')}
              >
                Grid
              </button>
              <button
                styleName={cn({ list: true, disabled: this.state.viewMode === 'list' })}
                onClick={() => this.setViewMode('list')}
              >
                List
              </button>
            </div>
          }
          {
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
          <section styleName={cn('hasChallenges', { 'list-view-active': this.state.viewMode === 'list' })}>
            <div styleName={cn('challenges', `${this.state.viewMode}-view`)}>
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
            <a href={`${config.URL.BASE}/my-challenges/?status=active`}>View More</a>
            <a href={`${config.URL.BASE}/my-challenges/?status=completed`}>Past Challenges</a>
          </div>
        }
      </div>
    );
  }
}

MyChallenges.propTypes = {
  stats: PT.shape(),
  challenges: PT.arrayOf(PT.shape()),
  communities: PT.arrayOf(PT.shape()),
  groups: PT.arrayOf(PT.shape()),
  communityList: PT.arrayOf(PT.shape({
    challengeFilter: PT.shape(),
    communityId: PT.string.isRequired,
    communityName: PT.string.isRequired,
  })),
};

MyChallenges.defaultProps = {
  stats: {},
  challenges: [],
  communities: [],
  groups: [],
  communityList: [],
};
