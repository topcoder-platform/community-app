/**
 * Child component of Settings/Profile/Sills renders "Skills" section of profile setting page.
 */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { toast } from 'react-toastify';

import Select from 'components/Select';

import DevFallbackIcon from 'assets/images/profile/skills/id-develop.svg';
import DesignFallbackIcon from 'assets/images/profile/skills/id-design.svg';
import DataFallbackIcon from 'assets/images/profile/skills/id-data.svg';
import { isomorphy } from 'topcoder-react-utils';

import './styles.scss';

let assets;
if (isomorphy.isClientSide()) {
  assets = require.context('assets/images/profile/skills', false, /svg/);
}

export default function Skills(props) {
  const {
    handle,
    tokenV3,
    profileState,
    settingsPageState,
    lookupData,
    addSkill,
    hideSkill,
  } = props;

  const {
    addingSkill,
    hidingSkill,
  } = profileState;

  const skills = settingsPageState.skills || {};

  const toggleSkill = (e, skill) => {
    e.preventDefault();
    if (skill.hidden && !addingSkill) {
      addSkill(handle, tokenV3, skill);
    } else if (!skill.hidden && !hidingSkill) {
      hideSkill(handle, tokenV3, skill);
    }
  };

  const onAddSkill = (skill) => {
    if (!skill || addingSkill) {
      return;
    }
    if (skills[skill.id] && !skills[skill.id].hidden) {
      toast.info(`You've already added skill "${skill.name}".`);
      return;
    }
    addSkill(handle, tokenV3, { tagId: skill.id, tagName: skill.name });
  };

  // All lookup skills
  const lookupSkills = lookupData.approvedSkills || [];
  const lookupSkillsMap = {};
  _.forEach(lookupSkills, (skill) => {
    lookupSkillsMap[skill.id] = skill;
  });

  // Construct user skills
  let userSkills = [];
  _.forEach(skills, (skill, tagId) => {
    const userSkill = { ...skill };
    userSkill.tagId = tagId;
    if (lookupSkillsMap[tagId] && lookupSkillsMap[tagId].categories
      && lookupSkillsMap[tagId].categories.length) {
      [userSkill.category] = lookupSkillsMap[tagId].categories;
    } else {
      userSkill.category = 'DEVELOP';
    }
    userSkills.push(userSkill);
  });
  userSkills = _.orderBy(userSkills, ['isNew', 'score'], ['desc', 'desc']);

  return (
    <div className="settings-section" styleName="skills">
      <div className="section-info">
        <h2>Skills</h2>
        <div className="description">Languages, environments, frameworks, libraries, platforms, tools, and any other technologies that you know well.</div>
      </div>
      <div className="section-fields" styleName="skills-section-fields">
        <div className="form-label">Add a new skill</div>
        <Select
          name="skills"
          options={lookupSkills}
          onChange={onAddSkill}
          placeholder="Start typing a skill then select from the list"
          matchPos="start"
          matchProp="name"
          labelKey="name"
          valueKey="name"
          clearable={false}
        />
        <div styleName="list">
          {
            _.map(userSkills, (skill) => {
              let linkStyle = '';
              if (skill.hidden) {
                linkStyle = 'skill-hidden';
              }
              if (skill.isNew) {
                linkStyle += ' new';
              }

              let FallbackIcon;
              switch (skill.category) {
                case 'DATA_SCIENCE':
                  FallbackIcon = DataFallbackIcon;
                  break;
                case 'DESIGN':
                  FallbackIcon = DesignFallbackIcon;
                  break;
                default:
                  FallbackIcon = DevFallbackIcon;
                  break;
              }

              return (
                <div styleName="skill" key={skill.tagId}>
                  <div styleName="skill-tile">
                    <a role="link" onClick={e => toggleSkill(e, skill)} styleName={linkStyle}>
                      <div styleName="skill-icon">
                        <div styleName="remove-indicator" />
                        <div styleName="hidden-indicator" />
                        { assets && assets.keys().includes(`./id-${skill.tagId}.svg`) ? <img src={assets(`./id-${skill.tagId}.svg`)} alt="Skill Icon" /> : <FallbackIcon /> }
                      </div>
                      <div styleName="name">{_.truncate(skill.tagName, { length: 20, separator: ' ' })}</div>
                    </a>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  );
}

Skills.propTypes = {
  handle: PT.string.isRequired,
  tokenV3: PT.string.isRequired,
  profileState: PT.shape().isRequired,
  settingsPageState: PT.shape().isRequired,
  lookupData: PT.shape().isRequired,
  addSkill: PT.func.isRequired,
  hideSkill: PT.func.isRequired,
};
