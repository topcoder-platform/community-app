import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import TagList from '../../TagList';
import SubtrackList from '../../SubtrackList';
import TrackList from '../../TrackList';
import { getMostRecentSubtracks, sortSkillsByScoreAndTag } from '../../helpers';

import './style.scss';

const UserStats = ({ member, userPlace, searchTermTag }) => {
  let userStatsList;

  const subtracks = getMostRecentSubtracks(member.stats, 5);

  if (subtracks.length) {
    userStatsList = <SubtrackList subtracks={subtracks} />;
  } else {
    userStatsList = <TrackList tracks={member.tracks} />;
  }

  // Highlight the skill that was searched for if the user has it
  // but only in the leaderboard, which is indicated by having userPlace
  const tag = _.isFinite(userPlace) ? searchTermTag : null;

  const skills = sortSkillsByScoreAndTag(member.skills, tag, 4);

  return (
    <div styleName="user-stats">
      <div className="aligner">
        <TagList tags={skills} label="Skills:" emptyMessage="No skills added" />

        {userStatsList}
      </div>
    </div>
  );
};

UserStats.propTypes = {
  member: PropTypes.shape({
    skills: PropTypes.arrayOf(PropTypes.shape({})),
    tracks: PropTypes.arrayOf(PropTypes.string),
    stats: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  userPlace: PropTypes.number,
  searchTermTag: PropTypes.shape({}),
};

UserStats.defaultProps = {
  userPlace: null,
  searchTermTag: null,
};

const mapStateToProps = ({ memberSearch }) => ({ searchTermTag: memberSearch.searchTermTag });

export default connect(mapStateToProps)(UserStats);
