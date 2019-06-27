/**
 * Skill Component.  Displays an icon and label dynamically based on data.
 */
import React from 'react';
import PT from 'prop-types';
import { truncate } from 'lodash';

import FallbackIcon from 'assets/images/profile/skills/id-develop.svg';
import VerifiedBadgeIcon from 'assets/images/verified-skill-badge.svg';
import { isomorphy } from 'topcoder-react-utils';

import './styles.scss';

let assets;
if (isomorphy.isClientSide()) {
  assets = require.context('assets/images/profile/skills', false, /svg/);
}

const Skill = ({
  tagId,
  tagName,
  isVerified,
}) => (
  <div styleName="container">
    <div styleName="skill-icon">
      { assets && assets.keys().includes(`./id-${tagId}.svg`) ? <img src={assets(`./id-${tagId}.svg`)} alt="Skill Icon" /> : <FallbackIcon /> }
    </div>
    <div styleName="name-wrapper">
      <div styleName="name">
        {truncate(tagName, 20)}
      </div>
      { isVerified && <div styleName="verified-badge"><VerifiedBadgeIcon /></div> }
    </div>
  </div>
);

Skill.propTypes = {
  tagId: PT.string.isRequired,
  tagName: PT.string.isRequired,
  isVerified: PT.string.isRequired,
};

export default Skill;
