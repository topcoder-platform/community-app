/**
 * Settings page component.
 */
import React from 'react';
import PT from 'prop-types';
import { MetaTags } from 'topcoder-react-utils';

import { TABS } from 'actions/page/settings';

import Header from './Header';
import TabBar from './TabBar';

import './style.scss';
import Profile from './Profile';
import Account from './Account';
import Preferences from './Preferences';
import Tools from './Tools';

export default function Settings(props) {
  const {
    settingsTab,
    selectSubtab
  } = props;
  
  

  let title;
  switch (settingsTab) {
    case TABS.ACCOUNT:
      title = 'Account Info';
      break;
    case TABS.TOOLS:
      title = 'Tools Details';
      break;
    case TABS.PREFERENCES:
      title = 'Preferences';
      break;
    default:
      title = 'Edit Profile';
      break;
  }

  return (
    <div styleName="container" className="profile-settings" style= {{padding: "30px 60px"}}>
      <MetaTags
        title={`${title} | TopCoder`}
        description="Profile setting page for Topcoder member"
      />
      <div styleName="page">
        <Header
          {...props}
          settingsTab= {settingsTab}
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
  selectSubtab: PT.func.isRequired
};
