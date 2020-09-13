/**
 * Stats Page.  Displays the stats of a TopCoder member.
 */
/* eslint-env browser */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import ReactSVG from 'react-svg';
import { Link, isomorphy } from 'topcoder-react-utils';
import { getRatingColor } from 'utils/tc';
import Th from 'assets/images/th.svg';
import LeftArrow from 'assets/images/arrow-prev.svg';
import {
  shouldShowGraph, getHistory, getSubTrackStats, getSummary, getDetails,
} from 'utils/memberStats';
import DistributionGraph from './DistributionGraph';
import HistoryGraph from './HistoryGraph';
import styles from './styles.scss';
import StatsModal from './StatsModal';
import SRMStats from './SRMStats';
import SubTrackChallengeView from './SubTrackChallengeView';

let assets;
if (isomorphy.isClientSide()) {
  assets = require.context('assets/images', false, /svg/);
}

class ProfileStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeGraph: 'history',
      showModal: false,
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.checkSRMHonor = this.checkSRMHonor.bind(this);
  }

  toggleModal() {
    const { showModal } = this.state;
    this.setState({ showModal: !showModal });
  }

  checkSRMHonor() {
    const { achievements } = this.props;
    return achievements && achievements.filter(achievement => achievement.description === 'SRM Engagement Honor').length > 0;
  }

  render() {
    const {
      statsDistribution,
      track,
      subTrack,
      tab: activeTab,
      info,
      handleParam,
      activeChallengesCount,
    } = this.props;
    let { stats, statsHistory } = this.props;
    if (_.isArray(stats)) {
      // eslint-disable-next-line prefer-destructuring
      stats = stats[0];
    }
    if (_.isArray(statsHistory)) {
      // eslint-disable-next-line prefer-destructuring
      statsHistory = statsHistory[0];
    }

    const { activeGraph, showModal } = this.state;

    const tabs = ['statistics'];
    if (track !== 'COPILOT') {
      tabs.push(subTrack === 'SRM' ? 'Past srm' : 'challenges');
    }

    const subTrackStats = getSubTrackStats(stats, track, subTrack);
    const subTrackSummary = getSummary(stats, track, subTrack) || [];
    const subTrackDetails = getDetails(stats, track, subTrack) || [];
    const ratingObj = subTrackSummary.filter(k => k.label === 'rating');
    let subTrackRating = ratingObj && ratingObj[0] ? ratingObj[0].value : 0;
    if (subTrackRating === 0 || !subTrackRating) { // if subtrack has no rating, pick default rating
      subTrackRating = info.maxRating ? info.maxRating.rating : 0;
    }

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
      <div styleName="profile-subtrack-container" role="main">
        <div styleName="content">
          <div styleName="page-state-header">
            <header>
              <div styleName="page-info">
                <Link to={`/members/${handleParam}`}>
                  <LeftArrow styleName="left-arrow" />
                </Link>
                &nbsp;
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
                {
                  this.checkSRMHonor()
                  && (
                  <div styleName="badgeItem">
                    <div styleName="dashboardBadge" />
                  </div>
                  )
                }
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
                  </li>
                ))
              }
            </ul>
            <ul styleName="subtrack-stats">
              {
                subTrackSummary
                && (
                  <li key={info.handle}>
                    <div>
                      { info.photoURL ? <img src={info.photoURL} onError={this.loadImageError} styleName="profile-circle" alt="Member Portait" /> : <ReactSVG path={assets('./ico-user-default.svg')} /> }
                    </div>
                    <div
                      styleName="valueHandle"
                      className={subTrackRating ? styles.rating : ''}
                      style={{ color: subTrackRating ? getRatingColor(parseInt(subTrackRating.toString().replace(/\D/g, ''), 10)) : undefined }}
                    >
                      <a href={`${window.origin}/members/${info.handle}`} target={`${_.includes(window.origin, 'www') ? '_self' : '_blank'}`} rel="noopener noreferrer">
                        {info.handle || '-'}
                      </a>
                    </div>
                  </li>
                )
              }
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
                        ? (
                          <HistoryGraph
                            history={getHistory(statsHistory, track, subTrack)}
                            track={track}
                            subTrack={subTrack}
                          />
                        )
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
  achievements: null,
};

ProfileStats.propTypes = {
  stats: PT.arrayOf(PT.shape()).isRequired,
  handleParam: PT.string.isRequired,
  track: PT.string.isRequired,
  subTrack: PT.string.isRequired,
  tab: PT.string,
  info: PT.shape().isRequired,
  statsDistribution: PT.shape(),
  statsHistory: PT.arrayOf(PT.shape()),
  activeChallengesCount: PT.number,
  achievements: PT.arrayOf(PT.shape()),
};

export default ProfileStats;
