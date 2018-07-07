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
    <nav styleName="settings-tab" style= {{height: "52px"}}>
      <ul>
        <li styleName={settingsTab === TABS.PROFILE ? 'active-tab' : 'inactive-tab'}><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TABS.PROFILE)} onClick={e => clickTab(e, TABS.PROFILE)} styleName={settingsTab === TABS.PROFILE ? 'activeLink' : 'inactiveLink'}>Profile</a></li>
        <li styleName={settingsTab === TABS.TOOLS ? 'active-tab' : 'inactive-tab'}><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TABS.TOOLS)} onClick={e => clickTab(e, TABS.TOOLS)} styleName={settingsTab === TABS.TOOLS ? 'activeLink' : 'inactiveLink'}>Tools</a></li>
        <li styleName={settingsTab === TABS.ACCOUNT ? 'active-tab' : 'inactive-tab'}><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TABS.ACCOUNT)} onClick={e => clickTab(e, TABS.ACCOUNT)} styleName={settingsTab === TABS.ACCOUNT ? 'activeLink' : 'inactiveLink'}>Account</a></li>  
        <li styleName={settingsTab === TABS.PREFERENCES ? 'active-tab' : 'inactive-tab'}><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TABS.PREFERENCES)} onClick={e => clickTab(e, TABS.PREFERENCES)} styleName={settingsTab === TABS.PREFERENCES ? 'activeLink' : 'inactiveLink'}>Preferences</a></li>
      </ul>
    </nav>
  );
}

TabBar.propTypes = {
  settingsTab: PT.string.isRequired,
  selectTab: PT.func.isRequired,
};

