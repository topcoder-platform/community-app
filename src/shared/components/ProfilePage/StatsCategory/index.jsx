/**
 * StatsCategory.  Displays the publicly available stats by category of a TopCoder member.
 */
/* eslint-env browser */
import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import PT from 'prop-types';
import { getRatingColor } from 'utils/tc';
import ArrowNext from 'assets/images/arrow-next.svg';
import CopilotIcon from 'assets/images/profile/ico-track-copilot.svg';
import DataScienceIcon from 'assets/images/profile/ico-track-data.svg';
import DesignIcon from 'assets/images/profile/ico-track-design.svg';
import DevelopIcon from 'assets/images/profile/ico-track-develop.svg';
import './styles.scss';

// Maps API track names to format in design
const TRACK_NAMES = {
  COPILOT: 'COPILOT',
  DATA_SCIENCE: 'DATA SCIENCE',
  DEVELOP: 'DEVELOPMENT',
  DESIGN: 'DESIGN',
};

/**
 * Inspects a subtrack and determines if the member is active
 * based on submissions and/or ranks.
 *
 * @param {Object} subtrack Subtrack object
 * @return {Boolean}
 */
const isActiveSubtrack = (subtrack) => {
  if (subtrack.name === 'COPILOT_POSTING') {
    return false;
  }
  if (subtrack.rank && subtrack.rank.rating > 0) {
    return true;
  } if (_.isNumber(subtrack.submissions)) {
    return subtrack.submissions > 0;
  }
  return subtrack.submissions && subtrack.submissions.submissions > 0;
};

class StatsCategory extends React.Component {
  getActiveTracks() {
    const { stats } = this.props;
    const activeTracks = [];

    if (stats.COPILOT && stats.COPILOT.fulfillment) {
      activeTracks.push({
        name: 'COPILOT',
        subTracks: [{
          fulfillment: stats.COPILOT.fulfillment,
          name: 'COPILOT',
        }],
      });
    }

    ['DEVELOP', 'DESIGN', 'DATA_SCIENCE'].forEach((track) => {
      const active = [];
      const subTracks = stats[track] ? stats[track].subTracks || [] : [];

      if (stats[track].SRM) {
        subTracks.push({ ...stats[track].SRM, name: 'SRM' });
      }
      if (stats[track].MARATHON_MATCH) {
        subTracks.push({ ...stats[track].MARATHON_MATCH, name: 'MARATHON MATCH' });
      }

      subTracks.forEach((subtrack) => {
        if (isActiveSubtrack(subtrack)) {
          active.push({ ...subtrack, active: true });
        }
      });
      if (active.length > 0) {
        const sorted = _.orderBy(active, [
          s => s.wins,
          s => (s.rank ? s.rank.rating : 0),
        ], ['desc', 'desc']);
        activeTracks.push({ name: track, subTracks: sorted });
      }
    });

    return activeTracks;
  }

  render() {
    const {
      handle,
      className,
      inModal,
      baseUrl,
    } = this.props;
    const activeTracks = this.getActiveTracks();
    return (
      <div styleName="categories" className={className}>
        {
          activeTracks.map(track => (
            <div id={track.name} key={track.name} styleName="track">
              <div styleName="name">
                {track.name === 'COPILOT' && <CopilotIcon />}
                {track.name === 'DATA_SCIENCE' && <DataScienceIcon />}
                {track.name === 'DESIGN' && <DesignIcon />}
                {track.name === 'DEVELOP' && <DevelopIcon />}
                <span>
                  {TRACK_NAMES[track.name]}
                  {' '}
                  {inModal ? '' : 'ACTIVITY'}
                </span>
              </div>
              {
                track.subTracks.map((subtrack, index) => (
                  <Link
                    to={`${baseUrl}/members/${handle}/details/?track=${track.name}&subTrack=${subtrack.name.replace(' ', '_')}`}
                    key={subtrack.name}
                    styleName={`subtrack ${index === 0 ? 'first' : ''}`}
                  >
                    <div
                      styleName="name"
                      style={inModal ? { fontSize: 16, marginLeft: 0 } : {}}
                    >
                      {subtrack.name.replace('FIRST_2_FINISH', 'FIRST2FINISH').replace(/_/g, ' ')}
                    </div>
                    {
                      subtrack.rank && !_.isNull(subtrack.rank.rating)
                      && (
                      <div styleName="ranking">
                        <div
                          style={{ color: getRatingColor(subtrack.rank.rating) }}
                          styleName="number"
                        >
                          {subtrack.rank.rating}
                        </div>
                        <div styleName="tag">
Rating
                        </div>
                      </div>
                      )
                    }
                    {
                      (!subtrack.rank || _.isNull(subtrack.rank.rating))
                      && !subtrack.fulfillment
                      && (
                      <div styleName="ranking">
                        <div style={{ color: '#21b2f1' }} styleName="number">
                          {subtrack.wins ? subtrack.wins : 0}
                        </div>
                        <div styleName="tag">
Wins
                        </div>
                      </div>
                      )
                    }
                    {
                      subtrack.fulfillment
                      && (
                      <div styleName="ranking">
                        <div style={{ color: '#a3a3ae' }} styleName="number">
                          {`${subtrack.fulfillment}%`}
                        </div>
                        <div styleName="tag">
Fulfillment
                        </div>
                      </div>
                      )
                    }
                    <ArrowNext styleName="arrow" />
                  </Link>
                ))
              }
            </div>
          ))
        }
      </div>
    );
  }
}

StatsCategory.defaultProps = {
  className: '',
  inModal: false,
  baseUrl: '',
};

StatsCategory.propTypes = {
  handle: PT.string.isRequired,
  stats: PT.shape().isRequired,
  inModal: PT.bool,
  className: PT.string,
  baseUrl: PT.string,
};

export default StatsCategory;
