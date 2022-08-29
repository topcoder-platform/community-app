/**
 * Stats Page.  Displays the stats of a TopCoder member.
 */
/* eslint-env browser */
/* eslint-disable no-shadow */
/* eslint-disable space-infix-ops */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import { getRatingColor } from 'utils/tc';
import {
  shouldShowGraph, getHistory, getSubTrackStats, getSummary, getDetails,
} from 'utils/memberStats';
import DistributionGraph from './DistributionGraph';
import HistoryGraph from './HistoryGraph';
import styles from './styles.scss';
import SRMStats from './SRMStats';
import SubTrackChallengeView from './SubTrackChallengeView';

// eslint-disable-next-line react/prefer-stateless-function
class ProfileStats extends React.Component {
  render() {
    const {
      statsDistribution,
      track,
      subTrack,
      setTab,
      info,
      handleParam,
      tab,
      isAlreadyLoadChallenge,
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

    const tabs = [];
    if (shouldShowGraph({ track, subTrack })) {
      tabs.push('statistics');
    }
    if (track !== 'COPILOT') {
      if (subTrack === 'SRM') {
        tabs.push('SRM Details');
        tabs.push('Past SRM');
      } else if (subTrack === 'MARATHON_MATCH') {
        tabs.push('Match Details');
      } else {
        tabs.push('Challenges Details');
      }
    }

    const activeTab = tab || (tabs.length > 0 ? tabs[0] : null);

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
        reliability.link = 'https://help.topcoder.com/hc/en-us/articles/219240797-Development-Reliability-Ratings-and-Bonuses';
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
          <ul styleName="subtrack-stats">
            { subTrackSummary.map(({ label, value, link }) => (
              <li key={label}>
                { link ? (
                  <a styleName="value" href={link}>
                    {value || '-'}
                  </a>
                ) : (
                  <div
                    styleName="value"
                    className={label === 'rating' ? styles.rating : ''}
                    style={{ color: label === 'rating' ? getRatingColor(parseInt(value.replace(/\D/g, ''), 10)) : undefined }}
                  >
                    {value || '-'}
                  </div>
                )}
                <p styleName="label">
                  {label}
                </p>
              </li>
            ))}
          </ul>

          { !!activeTab && (
            <div styleName="tab-container">
              <span styleName={`title ${tabs.filter(tab => tab !== activeTab).length > 0 ? 'has-tab': ''}`}>
                { activeTab }
              </span>
              <div styleName="tab-set">
                { /* eslint-disable-next-line no-confusing-arrow */
                  tabs.map(tab => tab === activeTab ? null : (
                    <PrimaryButton
                      key={tab}
                      theme={{ button: styles.btn }}
                      href="javascript:void(0)" /* eslint-disable-line no-script-url */
                      onClick={() => setTab(tab)}
                    >
                      { _.upperCase(`See ${tab}`) }
                    </PrimaryButton>
                  ))}
              </div>
            </div>
          )}

          { !!activeTab && <hr /> }

          { activeTab === 'statistics' && (
            <div styleName="statistics-graph-container">
              <div styleName="statistics-graph">
                <div styleName={`history ${subTrack === 'SRM' ? 'wide' : ''}`}>
                  <h2>
                    Rating History
                  </h2>
                  <HistoryGraph
                    history={getHistory(statsHistory, track, subTrack)}
                    track={track}
                    subTrack={subTrack}
                  />
                </div>

                <hr styleName="vertical" />

                <div styleName={`distribution ${subTrack === 'SRM' ? 'wide' : ''}`}>
                  <h2>
                    Rating Distribution
                  </h2>
                  <DistributionGraph
                    distribution={statsDistribution}
                    rating={_.get(subTrackStats, 'rank.rating')}
                    subTrack={subTrack}
                  />
                </div>

                { subTrack !== 'SRM' && <hr styleName="vertical" /> }

                { subTrack !== 'SRM' && (
                  <div styleName="details">
                    <h2>
                      Details
                    </h2>
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
                  </div>
                )}
              </div>
            </div>
          )}

          { (activeTab === 'Challenges Details' || activeTab === 'Match Details'
            || activeTab === 'Past SRM') && (
            <SubTrackChallengeView
              handle={handleParam}
              track={track}
              subTrack={subTrack}
              userId={info.userId}
              isAlreadyLoadChallenge={isAlreadyLoadChallenge}
            />
          )}

          { activeTab === 'SRM Details' && (
            <SRMStats subTrackDetails={subTrackDetails} />
          )}
        </div>
      </div>
    );
  }
}

ProfileStats.defaultProps = {
  statsDistribution: null,
  statsHistory: null,
  isAlreadyLoadChallenge: {
    current: false,
  },
};

ProfileStats.propTypes = {
  stats: PT.arrayOf(PT.shape()).isRequired,
  handleParam: PT.string.isRequired,
  track: PT.string.isRequired,
  subTrack: PT.string.isRequired,
  tab: PT.string.isRequired,
  setTab: PT.func.isRequired,
  info: PT.shape().isRequired,
  statsDistribution: PT.shape(),
  statsHistory: PT.arrayOf(PT.shape()),
  isAlreadyLoadChallenge: PT.shape({
    current: PT.bool,
  }),
};

export default ProfileStats;
