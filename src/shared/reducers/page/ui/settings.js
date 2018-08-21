/**
 * Reducers for settings page UI.
 */
import _ from 'lodash';
import { handleActions } from 'redux-actions';

import settingsActions from 'actions/page/ui/settings';

const TABS = {
  PROFILE: {
    BASIC: 'basic info',
    // LANGUAGE: 'language',
    SKILL: 'skill',
    // EDUCATION: 'education',
    // WORK: 'work',
    // ORGANIZATION: 'organization',
    HOBBY: 'hobby',
    COMMUNITY: 'community',
  },
  TOOLS: {
    DEVICES: 'devices',
    SOFTWARE: 'software',
    PROVIDERS: 'service providers',
    SUBSCRIPTIONS: 'subscriptions',
  },
  ACCOUNT: {
    MYACCOUNT: 'my account',
    LINKEDACCOUNT: 'linked account',
  },
};

const initState = {
  TABS,
};

/**
 * Creates a new reducer.
 * @param {Object} state Optional. Initial state.
 * @return {Function} Reducer.
 */
function create(defaultState = initState) {
  const a = settingsActions.settings;
  return handleActions({
    [a.profile.toggleTab]: (state, { payload }) => ({ ...state, currentProfileTab: payload }),
    [a.tools.toggleTab]: (state, { payload }) => ({ ...state, currentToolsTab: payload }),
    [a.account.toggleTab]: (state, { payload }) => ({ ...state, currentAccountTab: payload }),
  }, _.defaults(defaultState, {
    currentProfileTab: TABS.PROFILE.BASIC,
    currentToolsTab: TABS.TOOLS.DEVICES,
    currentAccountTab: TABS.ACCOUNT.MYACCOUNT,
  }));
}

/**
 * Factory which creates a new reducer with its initial state tailored to the
 * @return Promise which resolves to the new reducer.
 */
export function factory() {
  return Promise.resolve(create());
}

export default create();
