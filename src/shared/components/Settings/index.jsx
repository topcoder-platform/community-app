/**
 * Settings page component.
 */
import React from 'react';
import PT from 'prop-types';

import { TABS } from 'actions/page/settings';

import Header from './Header';
import TabBar from './TabBar';

import './style.scss';
import Profile from './Profile';
import Account from './Account';
import Preferences from './Preferences';
import EmailPreferences from './EmailPreferences';

export default function Settings(props) {
  const {
    settingsTab,
  } = props;

  const selectTab = (tab) => {
    props.selectTab(tab);
    props.history.push(`/settings/${tab}`);
  };

  return (
    <div styleName="container">
      <div styleName="page">
        <Header
          {...props}
        />
        <TabBar
          settingsTab={settingsTab}
          selectTab={selectTab}
        />
        {
          settingsTab === TABS.PROFILE &&
          <Profile
            {...props}
          />
        }
        {
          settingsTab === TABS.ACCOUNT &&
          <Account
            {...props}
          />
        }
        {
          settingsTab === TABS.EMAIL &&
          <EmailPreferences
            {...props}
          />
        }
        {
          settingsTab === TABS.PREFERENCES &&
          <Preferences
            {...props}
          />
        }
      </div>
    </div>
  );
}

Settings.propTypes = {
  settingsTab: PT.string.isRequired,
  profileState: PT.shape().isRequired,
  settingsPageState: PT.shape().isRequired,
  history: PT.shape().isRequired,
  selectTab: PT.func.isRequired,
};
