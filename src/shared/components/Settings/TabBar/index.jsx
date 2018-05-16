/**
 * Child component of Settings/TabBar renders bar for 4 tabs.
 */
import React from 'react';
import PT from 'prop-types';

import { TABS } from 'actions/page/settings';
import './styles.scss';

export default function TabBar(props) {
  const {
    settingsTab,
    selectTab,
  } = props;

  const clickTab = (e, tab) => {
    e.preventDefault();
    setImmediate(() => {
      selectTab(tab);
    });
  };

  return (
    <nav styleName="settings-tab">
      <ul>
        <li><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TABS.PROFILE)} onClick={e => clickTab(e, TABS.PROFILE)} styleName={settingsTab === TABS.PROFILE ? 'active-tab' : ''}>Profile</a></li>
        <li><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TABS.ACCOUNT)} onClick={e => clickTab(e, TABS.ACCOUNT)} styleName={settingsTab === TABS.ACCOUNT ? 'active-tab' : ''}>Account</a></li>
        <li><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TABS.EMAIL)} onClick={e => clickTab(e, TABS.EMAIL)} styleName={settingsTab === TABS.EMAIL ? 'active-tab' : ''}>Email</a></li>
        <li><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TABS.PREFERENCES)} onClick={e => clickTab(e, TABS.PREFERENCES)} styleName={settingsTab === TABS.PREFERENCES ? 'active-tab' : ''}>Preferences</a></li>
      </ul>
    </nav>
  );
}

TabBar.propTypes = {
  settingsTab: PT.string.isRequired,
  selectTab: PT.func.isRequired,
};

