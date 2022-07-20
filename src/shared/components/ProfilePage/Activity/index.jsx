import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import ActivityCard from './ActivityCard';

import './styles.scss';

/**
 * Inspects a subtrack and determines if it should be hidden
 *
 * @param {Object} subtrack Subtrack object
 * @returns {Boolean}
 */
const isHidden = (subtrack) => {
  if (subtrack.name === 'DEVELOP_MARATHON_MATCH') {
    return true;
  }

  return false;
};

const Activity = ({ memberStats, hasMM, onClick }) => {
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
    }
    if (_.isNumber(subtrack.submissions)) {
      return subtrack.submissions > 0;
    }
    return subtrack.submissions && subtrack.submissions.submissions > 0;
  };

  const QA_SUB_TRACKS = ['BUG_HUNT', 'TEST_SUITES', 'TEST_SCENARIOS'];

  const getActiveTracks = () => {
    let stats;
    if (_.isArray(memberStats)) {
      // eslint-disable-next-line prefer-destructuring
      stats = memberStats[0];
    }
    const activeTracks = [];
    const qaSubtracks = [];

    ['DESIGN', 'DEVELOP', 'DATA_SCIENCE'].forEach((track) => {
      const active = [];
      const subTracks = stats && stats[track] ? stats[track].subTracks || [] : [];

      if (stats && stats[track] && stats[track].SRM) {
        subTracks.push({ ...stats[track].SRM, name: 'SRM' });
      }
      if (stats && stats[track] && stats[track].MARATHON_MATCH) {
        subTracks.push({
          ...stats[track].MARATHON_MATCH,
          name: 'MARATHON MATCH',
        });
      }

      subTracks.forEach((subtrack) => {
        if (QA_SUB_TRACKS.includes(subtrack.name)) {
          qaSubtracks.push({ ...subtrack, active: true });
        } else if (
          (isActiveSubtrack(subtrack) && !isHidden(subtrack))
          || (subtrack.name === 'MARATHON MATCH' && hasMM)
        ) {
          active.push({ ...subtrack, active: true });
        }
      });
      if (active.length > 0) {
        const sorted = _.orderBy(
          active,
          [s => s.wins, s => (s.rank ? s.rank.rating : 0)],
          ['desc', 'desc'],
        );
        activeTracks.push({ name: track, subTracks: sorted });
      }
    });

    if (qaSubtracks.length > 0) {
      activeTracks.push({
        name: 'QA',
        subTracks: qaSubtracks,
      });
    }

    if (stats && stats.COPILOT && stats.COPILOT.fulfillment) {
      activeTracks.push({
        name: 'COPILOT',
        subTracks: [
          {
            fulfillment: stats.COPILOT.fulfillment,
            name: 'COPILOT',
          },
        ],
      });
    }

    return activeTracks;
  };

  const activeTracks = getActiveTracks();

  return (
    <div styleName="activity">
      <div styleName="header">
        <span>TC ACTIVITY</span>
      </div>

      {activeTracks.map((activeTrack, index) => (
        <ActivityCard
          key={`${activeTrack.name}-${index}`} /* eslint-disable-line react/no-array-index-key */
          trackName={activeTrack.name}
          subTracks={activeTrack.subTracks}
          hasMM={hasMM}
          onClick={onClick}
        />
      ))}
    </div>
  );
};

Activity.defaultProps = {
  memberStats: [],
};

Activity.propTypes = {
  memberStats: PT.arrayOf(PT.shape()),
  hasMM: PT.bool.isRequired,
  onClick: PT.func.isRequired,
};

export default Activity;
