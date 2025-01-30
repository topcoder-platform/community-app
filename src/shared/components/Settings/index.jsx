/**
 * Settings page component.
 */
import React, { useState } from 'react';
import PT from 'prop-types';
import MetaTags from 'components/MetaTags';

import { TABS } from 'actions/page/settings';

import _ from 'lodash';
import Header from './Header';
import ExperienceAndSkills from './ExperienceAndSkills';
import TopcoderAndYou from './TopcoderAndYou';
import Tools from './Tools';

import './style.scss';
import Account from './Account';
import Preferences from './Preferences';
import Payment from './Payment';
import TabSelector from './TabSelector';
import { SETTINGS_TABS } from './constants';

import ProfileSettings from './ProfileSettings';

export default function Settings(props) {
  const newProps = { ...props };
  if (newProps.settingsTab === newProps.match.params.settingsTab) {
    newProps.settingsTab = newProps.settingsTab;
  } else {
    newProps.settingsTab = newProps.match.params.settingsTab;
  }

  const selectTab = (tab) => {
    newProps.selectTab(tab);
    newProps.history.push(`/settings/${tab}`);
  };

  const currentTab = _.find(SETTINGS_TABS, { link: newProps.settingsTab });
  const title = currentTab ? currentTab.title : 'Settings';

  const profileRef = React.useRef();
  const tracksRef = React.useRef();
  const experienceAndSkillsRef = React.useRef();
  const toolsRef = React.useRef();
  const accountRef = React.useRef();
  const preferencesRef = React.useRef();

  const [isSaving, setIsSaving] = useState(false);

  return (
    <div styleName="container" className="profile-settings" role="presentation" onClick={() => {}}>
      <MetaTags
        title={`${title} | TopCoder`}
        description="Profile setting page for Topcoder member"
      />
      <div styleName="page">
        <Header
          settingsTab={newProps.settingsTab}
          selectTab={selectTab}
          saveSettings={() => {
            if (newProps.settingsTab === TABS.TRACKS) {
              tracksRef.current.onSaveTopcoderAndYou();
            } else if (newProps.settingsTab === TABS.PROFILE) {
              profileRef.current.onSaveProfile();
            } else if (newProps.settingsTab === TABS.SKILLS) {
              experienceAndSkillsRef.current.save();
            } else if (newProps.settingsTab === TABS.TOOLS) {
              toolsRef.current.save();
            } else if (newProps.settingsTab === TABS.ACCOUNT) {
              accountRef.current.save();
            } else if (newProps.settingsTab === TABS.PREFERENCES) {
              preferencesRef.current.save();
            }
          }}
          isSaving={isSaving}
        />
        <TabSelector activeTab={newProps.settingsTab} tabs={SETTINGS_TABS} selectTab={selectTab} />
        {
          newProps.settingsTab === TABS.PROFILE
          && (
            <ProfileSettings
              {...newProps}
              ref={profileRef}
              isSaving={isSaving}
              setIsSaving={setIsSaving}
            />
          )
        }
        {
          newProps.settingsTab === TABS.SKILLS
          && (
            <ExperienceAndSkills
              ref={experienceAndSkillsRef}
              {...newProps}
              isSaving={isSaving}
              setIsSaving={setIsSaving}
            />
          )
        }
        {
          newProps.settingsTab === TABS.TRACKS
          && (
            <TopcoderAndYou
              ref={tracksRef}
              {...newProps}
              isSaving={isSaving}
              setIsSaving={setIsSaving}
            />
          )
        }
        {
          newProps.settingsTab === TABS.TOOLS
          && (
            <Tools
              ref={toolsRef}
              {...newProps}
              isSaving={isSaving}
              setIsSaving={setIsSaving}
            />
          )
        }
        {
          newProps.settingsTab === TABS.ACCOUNT
          && (
            <Account
              ref={accountRef}
              {...newProps}
              isSaving={isSaving}
              setIsSaving={setIsSaving}
            />
          )
        }
        {
          newProps.settingsTab === TABS.PREFERENCES
          && (
            <Preferences
              ref={preferencesRef}
              {...newProps}
              isSaving={isSaving}
              setIsSaving={setIsSaving}
            />
          )
        }
        {
          newProps.settingsTab === TABS.PAYMENT
          && (
            <Payment handle={newProps.handle} />
          )
        }
      </div>
    </div>
  );
}

Settings.defaultProps = {
  handle: '',
};

Settings.propTypes = {
  settingsTab: PT.string.isRequired,
  profileState: PT.shape().isRequired,
  settingsPageState: PT.shape().isRequired,
  history: PT.shape().isRequired,
  selectTab: PT.func.isRequired,
  handle: PT.string,
};
