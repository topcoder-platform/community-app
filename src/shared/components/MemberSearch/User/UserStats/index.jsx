/* eslint-disable react/no-array-index-key */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import TrackItem from '../../../ProfilePage/MemberTracks/TrackItem';
import { trackMap } from '../../../ProfilePage/MemberTracks';
import List from '../../../ProfilePage/Skills/List';

import './style.scss';

const UserStats = ({ tracks, skills }) => {
  const normalizeSkills = skills.map((skill, index) => ({ tagId: index, tagName: skill.name }));
  const verifiedSkills = _.filter(normalizeSkills, skill => _.includes(skill.sources, 'CHALLENGE'));
  const userEnteredSkills = _.filter(normalizeSkills, skill => !_.includes(skill.sources, 'CHALLENGE'));

  const renderTracks = (
    <div styleName="tracks">
      {
        tracks.map((track, index) => (
          <TrackItem key={index} trackName={trackMap[track] || ''} />
        ))
      }
    </div>
  );

  const renderSkills = (
    <div styleName="skills">
      <List
        skills={verifiedSkills}
        isVerified
      />

      <List
        skills={userEnteredSkills}
        isVerified
      />
    </div>
  );

  return (
    <div styleName="user-stats">
      <div>{tracks.length ? renderTracks : <span styleName="not-found-text track">No track added</span>}</div>
      <div styleName="skills-wrapper">{skills.length ? renderSkills : <span styleName="not-found-text">No skills added</span>}</div>
    </div>
  );
};

UserStats.defaultProps = {
  tracks: [],
  skills: [],
};

UserStats.propTypes = {
  tracks: PT.arrayOf(PT.shape()),
  skills: PT.arrayOf(PT.shape()),
};

export default UserStats;
