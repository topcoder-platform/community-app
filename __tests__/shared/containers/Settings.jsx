import _ from 'lodash';
import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Settings from 'containers/Settings';
import { TABS } from 'actions/page/settings';

import userProfile from '../components/Settings/__mocks__/user-profile.json';
import profileState from '../components/Settings/__mocks__/profile-state.json';

const rnd = new Renderer();

const mockState = {
  page: {
    dashboard: { xlBadge: '' },
    settings: { settingsTab: TABS.PROFILE },
  },
  auth: {
    authenticating: false,
    tokenV3: 'tokenV3',
    user: {
      handle: userProfile.handle,
    },
    profile: userProfile,
  },
  profile: profileState,
  lookup: {},
};

it('renders profile setting page correctly', () => {
  const state = _.cloneDeep(mockState);
  state.page.settings.settingsTab = TABS.PROFILE;
  rnd.render((
    <Settings
      store={{
        dispatch: () => _.noop,
        getState: () => state,
        subscribe: _.noop,
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

it('renders account setting page correctly', () => {
  const state = _.cloneDeep(mockState);
  state.page.settings.settingsTab = TABS.ACCOUNT;
  rnd.render((
    <Settings
      store={{
        dispatch: () => _.noop,
        getState: () => state,
        subscribe: _.noop,
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

it('renders email setting page correctly', () => {
  const state = _.cloneDeep(mockState);
  state.page.settings.settingsTab = TABS.EMAIL;
  rnd.render((
    <Settings
      store={{
        dispatch: () => _.noop,
        getState: () => state,
        subscribe: _.noop,
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

it('renders preferences setting page correctly', () => {
  const state = _.cloneDeep(mockState);
  state.page.settings.settingsTab = TABS.PREFERENCES;
  rnd.render((
    <Settings
      store={{
        dispatch: () => _.noop,
        getState: () => state,
        subscribe: _.noop,
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
