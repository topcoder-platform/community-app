/**
 * Child component of Settings/Profile/Sills renders "Skills" section of profile setting page.
 */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import _ from 'lodash';
import path from 'path';
import React from 'react';
import PT from 'prop-types';
import { toastr } from 'react-redux-toastr';
import requireContext from 'require-context';

import Select from 'components/Select';

import DevFallbackIcon from 'assets/images/profile/skills/id-develop.svg';
import DesignFallbackIcon from 'assets/images/profile/skills/id-design.svg';
import DataFallbackIcon from 'assets/images/profile/skills/id-data.svg';
import { isomorphy } from 'topcoder-react-utils';

import './styles.scss';

let assets;
if (process.env.NODE_ENV !== 'test') {
  if (isomorphy.isClientSide()) {
    // require.context is only available in webpack bundled client code
    assets = require.context('assets/images/profile/skills', false, /svg/);
  } else {
    assets = requireContext(path.dirname(require.resolve('assets/images/profile/skills/id-data.svg')), false, /svg/);
  }
}

/**
 * Get image.
 * @param {String} imageFile The image file name
 * @returns {Element} React element
 */
function getImage(imageFile) {
  if (isomorphy.isClientSide()) {
    return <img src={assets(`./${imageFile}`)} alt="Skill Icon" />;
  }
  const Image = assets(imageFile);
  return <Image />;
}

/**
 * Check image exists.
 * @param {String} imageFile The image file name
 * @returns {Boolean} True if image exists; false otherwise
 */
function imageExist(imageFile) {
  if (!assets) {
    return false;
  }
  return (isomorphy.isClientSide() && assets.keys().includes(`./${imageFile}`)) || assets.keys().includes(imageFile);
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
      toastr.info('', `You've already added skill "${skill.name}".`);
      return;
    }
    addSkill(handle, tokenV3, { tagId: skill.id, tagName: skill.name });
  };

  // All lookup skills
  const lookupSkills = lookupData.skillTags || [];
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
        <h2>
Skills
        </h2>
        <div className="description">
          Languages, environments, frameworks, libraries, platforms, tools,
          and any other technologies that you know well.
        </div>
      </div>
      <div className="section-fields" styleName="skills-section-fields">
        <div className="form-label">
Add a new skill
        </div>
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
                        { imageExist(`id-${skill.tagId}.svg`) ? getImage(`id-${skill.tagId}.svg`) : <FallbackIcon /> }
                      </div>
                      <div styleName="name">
                        {_.truncate(skill.tagName, { length: 20, separator: ' ' })}
                      </div>
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
