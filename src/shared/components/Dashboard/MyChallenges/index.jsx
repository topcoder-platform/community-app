/* eslint jsx-a11y/no-noninteractive-element-interactions:0 */

import React from 'react';
import PT from 'prop-types';
import cn from 'classnames';
import _ from 'lodash';

import config from 'utils/config';
import ChallengeTile from './ChallengeTile';
import ChallengeFilter from './ChallengeFilter';
import './styles.scss';

export default class MyChallenges extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      viewMode: 'tile',
      selectedGroupId: '',
    };
    this.setViewMode = this.setViewMode.bind(this);
    this.setTab = this.setTab.bind(this);
    this.selectGroup = this.selectGroup.bind(this);
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

  selectGroup(id) {
    this.setState({
      selectedGroupId: id,
    });
  }

  render() {
    let challenges = this.props.challenges;
    if (this.state.selectedGroupId) {
      challenges = _.filter(challenges, c => c.groups[this.state.selectedGroupId]);
    }

    const groups = _.map(this.props.groups, (g) => {
      const group = _.cloneDeep(g);
      group.number = _.filter(this.props.challenges, (c) => {
        if (c.groups[group.id]) {
          // eslint-disable-next-line no-param-reassign
          c.groupLabel = group.name;
          return true;
        }
        return false;
      },
      ).length;
      return group;
    });

    groups.unshift({
      name: 'All communities',
      id: '',
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
        </header>
        {
          this.state.activeTab === 0 && this.props.challenges && this.props.challenges.length > 0 &&
          <section styleName={cn('hasChallenges', { 'list-view-active': this.state.viewMode === 'list' })}>
            {
              this.state.viewMode === 'list' &&
              <div styleName="filter-wrapper">
                <div>
                  <ChallengeFilter
                    groups={groups}
                    selectedGroupId={this.state.selectedGroupId}
                    selectGroup={this.selectGroup}
                  />
                </div>
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
            <div styleName={cn('challenges', `${this.state.viewMode}-view`)}>
              {
                this.state.viewMode === 'tile' &&
                <ChallengeFilter
                  groups={groups}
                  selectedGroupId={this.state.selectedGroupId}
                  selectGroup={this.selectGroup}
                />
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
          </section>
        }
        {
          this.state.activeTab === 1 && this.props.groups && this.props.groups.length > 0 &&
          <section styleName="communities">
            {
              this.props.groups.map(group => (
                <div styleName="community-tile" key={group.id}>
                  <header>{group.name}</header>
                </div>
              ))
            }
          </section>
        }
        {
          this.state.activeTab === 0 &&
          <div styleName="my-challenges-links">
            <a href={`https://www.${config.DOMAIN}/my-challenges/?status=active`}>View More</a>
            <a href={`https://www.${config.DOMAIN}/my-challenges/?status=completed`}>Past Challenges</a>
          </div>
        }
      </div>
    );
  }
}

MyChallenges.propTypes = {
  challenges: PT.arrayOf(PT.shape()),
  groups: PT.arrayOf(PT.shape()),
};

MyChallenges.defaultProps = {
  challenges: [],
  groups: [],
};
