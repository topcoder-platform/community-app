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
import EmailPreferences from './EmailPreferences';

export default function Settings(props) {
  const {
    settingsTab,
  } = props;

  const selectTab = (tab) => {
    props.selectTab(tab);
    props.history.push(`/settings/${tab}`);
  };

  let title;
  switch (settingsTab) {
    case TABS.TOOLS:
      title = 'Tools';
      break;
    case TABS.ACCOUNT:
      title = 'Account Info';
      break;
    case TABS.EMAIL:
      title = 'Email Preferences';
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
          settingsTab === TABS.TOOLS &&
          <Tools
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
