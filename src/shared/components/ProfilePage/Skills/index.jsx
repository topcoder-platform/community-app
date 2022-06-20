import React from 'react';
import PT from 'prop-types';

import './styles.scss';
import _ from 'lodash';
import VerifiedBadge from 'assets/images/profile/verified-icon.svg';
import List from './List';

const Skills = ({ skills, isMobile }) => {
  const verifiedSkills = _.filter(skills, skill => _.includes(skill.sources, 'CHALLENGE'));
  const userEnteredSkills = _.filter(skills, skill => !_.includes(skill.sources, 'CHALLENGE'));

  return (
    <div styleName="skills">
      <h3 styleName="title">
        Skills
      </h3>

      <List
        skills={verifiedSkills}
        isMobile={isMobile}
        isVerified
      />

      <List
        skills={userEnteredSkills}
        isMobile={isMobile}
        isVerified={false}
      />

      <div styleName="info">
        <VerifiedBadge />

        <span>= Topcoder Verified</span>
      </div>

    </div>
  );
};

Skills.defaultProps = {
  skills: [],
};

Skills.propTypes = {
  skills: PT.arrayOf(PT.shape),
  isMobile: PT.bool.isRequired,
};

export default Skills;
