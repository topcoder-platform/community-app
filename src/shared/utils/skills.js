import _ from 'lodash';

const LOCAL_STORAGE_SKILLS = 'LOCAL_STORAGE_SKILLS';

let userSkills = null;

/**
 * Save skills into local storage
 *
 * @param {Array} skills skill array
 */
export function saveSkills(skills) {
  if (!userSkills) {
    userSkills = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SKILLS) || '{}');
  }
  _.forEach(skills, (skill) => {
    userSkills[skill.value || skill.id] = skill.label || skill.name;
  });
  localStorage.setItem(LOCAL_STORAGE_SKILLS, JSON.stringify(userSkills));
}

/**
 * Get skill from local storage
 *
 * @param {String} skillId skill id
 * @returns
 */
export function getSkills(skillId) {
  if (!userSkills) {
    userSkills = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SKILLS) || '{}');
  }
  return userSkills[skillId] || skillId;
}
