/**
 * Stats Page.  Displays the stats of a TopCoder member.
 */
/* eslint-env browser */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { Link } from 'react-router-dom';
import { getRatingColor } from 'utils/tc';
import Th from 'assets/images/th.svg';
import {
  shouldShowGraph, getHistory, getSubTrackStats, getSummary, getDetails,
} from 'utils/memberStats';
import DistributionGraph from './DistributionGraph';
import HistoryGraph from './HistoryGraph';
import styles from './styles.scss';
import StatsModal from './StatsModal';
import SRMStats from './SRMStats';
import SubTrackChallengeView from './SubTrackChallengeView';


class ProfileStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeGraph: 'history',
      showModal: false,
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    const { showModal } = this.state;
    this.setState({ showModal: !showModal });
  }

  render() {
    const {
      stats,
      statsDistribution,
      statsHistory,
      track,
      subTrack,
      tab: activeTab,
      info,
      handleParam,
      activeChallengesCount,
    } = this.props;

    const { activeGraph, showModal } = this.state;

    const tabs = ['statistics'];
    if (track !== 'COPILOT') {
      tabs.push(subTrack === 'SRM' ? 'Past srm' : 'challenges');
    }

    const subTrackStats = getSubTrackStats(stats, track, subTrack);
    const subTrackSummary = getSummary(stats, track, subTrack);
    const subTrackDetails = getDetails(stats, track, subTrack);

    if (track === 'DEVELOP') {
      const reliability = subTrackSummary.find(stat => stat.label === 'reliability');
      if (reliability) {
        reliability.link = 'https://help.topcoder.com/hc/en-us/articles/219240797-Development-Reliability-Ratings- and-Bonuses';
      }
      const mustHaveMetrics = ['rank', 'rating', 'reliability'];
      // check if rating, rank & reliability are all set
      const filteredObjs = _.filter(subTrackSummary, k => _.indexOf(mustHaveMetrics, k.label) > -1);
      if (_.every(_.map(filteredObjs, 'value'), v => !v)) {
        // all false filter em out
        _.remove(subTrackSummary, k => _.indexOf(mustHaveMetrics, k.label) > -1);
      }
    }

    return (
      <div styleName="profile-subtrack-container">
        <div styleName="content">
          <div styleName="page-state-header">
            <header>
              <div styleName="page-info">
                <h1>
                  {subTrack.replace('FIRST_2_FINISH', 'FIRST2FINISH').replace(/_/g, ' ')}
                </h1>
                <a styleName="nav-right" onClick={this.toggleModal} onKeyPress={this.toggleModal} role="button" tabIndex={0}>
                  <Th height={16} width={16} />
                </a>
              </div>
              <div styleName="info">
                <div styleName="item">
                  <div styleName="value">
                    {activeChallengesCount}
                  </div>
                  <div styleName="title">
Active Challenges
                  </div>
                </div>
              </div>
            </header>
          </div>
          <div>
            <ul styleName="tab-set">
              {
                tabs.map(tab => (
                  <li key={tab}>
                    <Link
                      className={activeTab === tab ? styles.selected : ''}
                      to={`/members/${handleParam}/details/?track=${track}&subTrack=${subTrack}&tab=${tab}`}
                    >
                      {tab}
                    </Link>
                  </li>))
              }
            </ul>
            <ul styleName="subtrack-stats">
              {
                subTrackSummary.map(({ label, value, link }) => (
                  <li key={label}>
                    {
                      link
                        ? (
                          <a styleName="value" href={link}>
                            {value || '-'}
                          </a>
                        )
                        : (
                          <div
                            styleName="value"
                            className={label === 'rating' ? styles.rating : ''}
                            style={{ color: label === 'rating' ? getRatingColor(parseInt(value.replace(/\D/g, ''), 10)) : undefined }}
                          >
                            {value || '-'}
                            {label === 'rating' && <span styleName="square" style={{ backgroundColor: getRatingColor((parseInt(value.replace(/\D/g, ''), 10))) }} />}
                          </div>
                        )
                    }
                    <p styleName="label">
                      {label}
                    </p>
                  </li>
                ))
              }
            </ul>
            {
              activeTab === 'statistics'
              && (
              <div className="tab-view">
                {
                  shouldShowGraph({ track, subTrack })
                  && (
                  <div styleName="statistics-graph">
                    <div styleName="graph-title">
                      <div styleName="text">
                        {activeGraph === 'history' ? 'Rating History Graph' : 'Rating Distribution Graph'}
                      </div>
                      <div className="button-group">
                        <button
                          className={`tc-btn tc-btn-s ${activeGraph === 'history' ? 'active' : ''}`}
                          onClick={() => this.setState({ activeGraph: 'history' })}
                          type="button"
                        >
                          View Rating History
                        </button>
                        <button
                          className={`tc-btn tc-btn-s ${activeGraph === 'distribution' ? 'active' : ''}`}
                          onClick={() => this.setState({ activeGraph: 'distribution' })}
                          type="button"
                        >
                          View Rating Distribution
                        </button>
                      </div>
                    </div>
                    {
                      activeGraph === 'history'
                        ? <HistoryGraph history={getHistory(statsHistory, track, subTrack)} />
                        : (
                          <DistributionGraph
                            distribution={statsDistribution}
                            rating={_.get(subTrackStats, 'rank.rating')}
                          />
                        )
                    }
                  </div>
                  )
                }
                {
                  track !== 'COPILOT'
                    && (
                    <div styleName="details">
                      <h2>
Details
                      </h2>
                      {
                        subTrack !== 'SRM'
                          ? (
                            <ul styleName="vertical-stats">
                              {
                              subTrackDetails.map(({ label, value }) => (
                                <li key={label}>
                                  <div>
                                    {label}
                                  </div>
                                  <div styleName="right">
                                    {value || '-'}
                                  </div>
                                </li>
                              ))
                            }
                            </ul>
                          )
                          : <SRMStats subTrackDetails={subTrackDetails} />
                      }
                    </div>
                    )
                }
              </div>
              )
            }
            {
              (activeTab === 'challenges' || activeTab === 'Past srm')
                && (
                <SubTrackChallengeView
                  handle={handleParam}
                  track={track}
                  subTrack={subTrack}
                  userId={info.userId}
                />
                )
            }
          </div>
        </div>
        {showModal && <StatsModal stats={stats} info={info} onClose={this.toggleModal} />}
      </div>
    );
  }
}

ProfileStats.defaultProps = {
  tab: 'statistics',
  statsDistribution: null,
  statsHistory: null,
  activeChallengesCount: null,
};

ProfileStats.propTypes = {
  stats: PT.shape().isRequired,
  handleParam: PT.string.isRequired,
  track: PT.string.isRequired,
  subTrack: PT.string.isRequired,
  tab: PT.string,
  info: PT.shape().isRequired,
  statsDistribution: PT.shape(),
  statsHistory: PT.shape(),
  activeChallengesCount: PT.number,
};

export default ProfileStats;
