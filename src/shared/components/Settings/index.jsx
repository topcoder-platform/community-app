/**
 * Settings page component.
 */
import React from 'react';
import PT from 'prop-types';
import { MetaTags } from 'topcoder-react-utils';

import { TABS } from 'actions/page/settings';

import Header from './Header';
import Tools from './Tools';

import './style.scss';
import Profile from './Profile';
import Account from './Account';
import Preferences from './Preferences';

export default function Settings(props) {
  const newProps = { ...props };
  if (newProps.settingsTab !== newProps.match.params.settingsTab) {
    newProps.settingsTab = newProps.match.params.settingsTab;
  }

  const selectTab = (tab) => {
    newProps.selectTab(tab);
    newProps.history.push(`/settings/${tab}`);
  };

  let title;
  switch (newProps.settingsTab) {
    case TABS.TOOLS:
      title = 'Tools';
      break;
    case TABS.ACCOUNT:
      title = 'Account Info';
      break;
    case TABS.PREFERENCES:
      title = 'Preferences';
      break;
    default:
      title = 'Edit Profile';
      break;
  }

  return (
    <div styleName="container" className="profile-settings">
      <MetaTags
        title={`${title} | TopCoder`}
        description="Profile setting page for Topcoder member"
      />
      <div styleName="page">
        <Header
          settingsTab={newProps.settingsTab}
          selectTab={selectTab}
        />
        {
          newProps.settingsTab === TABS.PROFILE
          && (
            <Profile
              {...newProps}
            />
          )
        }
        {
          newProps.settingsTab === TABS.TOOLS
          && (
            <Tools
              {...newProps}
            />
          )
        }
        {
          newProps.settingsTab === TABS.ACCOUNT
          && (
            <Account
              {...newProps}
            />
          )
        }
        {
          newProps.settingsTab === TABS.PREFERENCES
          && (
            <Preferences
              {...newProps}
            />
          )
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
