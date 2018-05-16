/**
 * Reducers for settings page UI.
 */
import _ from 'lodash';
import { config } from 'topcoder-react-utils';
import { handleActions } from 'redux-actions';
import { toastr } from 'react-redux-toastr';

import actions, { TABS } from 'actions/page/settings';
import profileActions from 'actions/profile';

function toastrSuccess(title, message) {
  setImmediate(() => {
    toastr.success(title, message);
  });
}

function mergeSkills(state, { type, payload, error }) {
  if (error) {
    return state;
  }

  if (type === 'PROFILE/ADD_SKILL_DONE') {
    toastrSuccess('Success! ', `Skill "${payload.skill.tagName}" was added.`);
  } else if (type === 'PROFILE/HIDE_SKILL_DONE') {
    toastrSuccess('Success! ', `Skill "${payload.skill.tagName}" was removed.`);
  }

  const firstTime = state.skills === undefined;

  const oldSkills = state.skills || {};
  const newSkills = payload.skills || {};

  const mergedSkills = {};

  let maxIsNew = 0;

  _.forEach(oldSkills, (oldSkill, tagId) => {
    const newSkill = newSkills[tagId];
    if (!newSkill) {
      // Mark the old skill as hidden
      mergedSkills[tagId] = {
        ...oldSkill,
        hidden: true,
      };
    } else {
      // Copy the new skill except 'isNew' field
      mergedSkills[tagId] = {
        ...newSkill,
        isNew: oldSkill.isNew,
      };
    }

    if (oldSkill.isNew && oldSkill.isNew > maxIsNew) {
      maxIsNew = oldSkill.isNew;
    }
  });

  _.forEach(newSkills, (newSkill, tagId) => {
    const oldSkill = oldSkills[tagId];
    if (!oldSkill) {
      if (!firstTime) {
        maxIsNew += 1;
      }
      // Add the new skill and set 'isNew' field
      mergedSkills[tagId] = {
        ...newSkill,
        isNew: firstTime ? 0 : maxIsNew,
      };
    }
  });

  return {
    ...state,
    skills: mergedSkills,
  };
}

function onAddWebLinkDone(state, { error }) {
  if (error) {
    return state;
  }
  toastrSuccess('Success!', 'Your link has been added. Data from your link will be visible on your profile shortly.');

  return state;
}

function onDeleteWebLinkInit(state, { payload, error }) {
  if (error) {
    return state;
  }

  return {
    ...state,
    deletingLinks: [...state.deletingLinks, payload],
  };
}

function onDeleteWebLinkDone(state, { payload, error }) {
  if (error || !payload.data) {
    return state;
  }
  toastrSuccess('Success! ', `Your web link "${payload.data.URL}" was removed.`);

  const deletingLinks = _.filter(state.deletingLinks, l => l.key !== payload.data.key);

  return {
    ...state,
    deletingLinks,
  };
}

function onLinkExternalAccountDone(state, { payload, error }) {
  if (!error) {
    toastrSuccess('Success! ', `Your ${payload.data.providerType} account has been linked. Data from your linked account will be visible on your profile shortly.`);
  }
  return state;
}

function onUnlinkExternalAccountInit(state, { payload, error }) {
  if (error) {
    return state;
  }

  return {
    ...state,
    deletingLinks: [...state.deletingLinks, payload],
  };
}

function onUnlinkExternalAccountDone(state, { payload, error }) {
  if (!error) {
    toastrSuccess('Success! ', `Your ${payload.providerType} account has been unlinked.`);
  }

  const deletingLinks = _.filter(state.deletingLinks, l => l.providerType !== payload.providerType);

  return {
    ...state,
    deletingLinks,
  };
}

function onUpdatePasswordDone(state, { error }) {
  if (error) {
    return { ...state, incorrectPassword: true };
  }
  toastrSuccess('Success! ', 'Your password was updated.');

  return { ...state, incorrectPassword: false };
}

function onUpdateProfileDone(state, { error }) {
  if (!error) {
    toastrSuccess('Success! ', 'Your account information was updated.');
  }
  return state;
}

function onUploadPhotoDone(state, { error }) {
  if (!error) {
    toastrSuccess('Success! ', 'Your profile image was updated.');
  }
  return state;
}

function onDeletePhotoDone(state, { error }) {
  if (!error) {
    toastrSuccess('Success! ', 'Your profile image was deleted.');
  }
  return state;
}

function onSaveEmailPreferencesDone(state, { error }) {
  if (!error) {
    toastrSuccess('Success! ', 'Your email preferences were updated.');
  }
  return state;
}

/**
 * Creates a new reducer.
 * @param {Object} state Optional. Initial state.
 * @return {Function} Reducer.
 */
function create(defaultState = {}) {
  const a = actions.page.settings;
  return handleActions({
    [a.selectTab]: (state, { payload }) => ({
      settingsTab: payload,
      deletingLinks: state.deletingLinks,
    }),
    [a.clearIncorrectPassword]: state => ({ ...state, incorrectPassword: false }),
    [profileActions.profile.getSkillsDone]: mergeSkills,
    [profileActions.profile.addSkillDone]: mergeSkills,
    [profileActions.profile.hideSkillDone]: mergeSkills,
    [profileActions.profile.updateProfileDone]: onUpdateProfileDone,
    [profileActions.profile.updatePasswordDone]: onUpdatePasswordDone,
    [profileActions.profile.uploadPhotoDone]: onUploadPhotoDone,
    [profileActions.profile.deletePhotoDone]: onDeletePhotoDone,
    [profileActions.profile.saveEmailPreferencesDone]: onSaveEmailPreferencesDone,
    [profileActions.profile.addWebLinkDone]: onAddWebLinkDone,
    [profileActions.profile.deleteWebLinkInit]: onDeleteWebLinkInit,
    [profileActions.profile.deleteWebLinkDone]: onDeleteWebLinkDone,
    [profileActions.profile.linkExternalAccountDone]: onLinkExternalAccountDone,
    [profileActions.profile.unlinkExternalAccountInit]: onUnlinkExternalAccountInit,
    [profileActions.profile.unlinkExternalAccountDone]: onUnlinkExternalAccountDone,
  }, _.defaults(defaultState, {
    settingsTab: TABS.PROFILE,
    deletingLinks: [],
  }));
}

/**
 * Factory which creates a new reducer with its initial state tailored to the
 * ExpressJS HTTP request, if specified (for server-side rendering). If HTTP
 * request is not specified, it creates just the default reducer.
 * @param {Object} req Optional. ExpressJS HTTP request.
 * @return Promise which resolves to the new reducer.
 */
export function factory(req) {
  // Check to see if a specific tab is provided as a param
  if (req && req.url) {
    const { pathname } = require('url').parse(`${config.URL.APP}${req.url}`); /* eslint-disable-line global-require */
    const match = pathname.match(/^\/settings\/(profile|account|email|preferences)(\/)?$/);
    if (match && match[1]) {
      return Promise.resolve(create({
        settingsTab: match[1],
      }));
    }
    return Promise.resolve(create());
  }

  return Promise.resolve(create());
}

export default create();
