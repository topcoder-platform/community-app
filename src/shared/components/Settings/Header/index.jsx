/**
 * Child component of Settings/Header
 */
import React from 'react';
import PT from 'prop-types';
import { TABS } from 'actions/page/settings';

import './styles.scss';

export default function Header(props) {
  const {
    selectTab,
    settingsTab,
  } = props;

  const clickTab = (e, tab) => {
    e.preventDefault();
    setImmediate(() => {
      selectTab(tab);
    });
  };

  return (
    <div styleName="page-state-header">
      <div styleName="page-info">
        <h1>
Settings
        </h1>
      </div>
      <div styleName="menu-list">
        <a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TABS.PROFILE)} onClick={e => clickTab(e, TABS.PROFILE)} styleName={settingsTab === TABS.PROFILE ? 'active-tab' : 'tab'}>
Profile
        </a>
        <a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TABS.TOOLS)} onClick={e => clickTab(e, TABS.TOOLS)} styleName={settingsTab === TABS.TOOLS ? 'active-tab' : 'tab'}>
Tools
        </a>
        <a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TABS.ACCOUNT)} onClick={e => clickTab(e, TABS.ACCOUNT)} styleName={settingsTab === TABS.ACCOUNT ? 'active-tab' : 'tab'}>
Account
        </a>
        <a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TABS.PREFERENCES)} onClick={e => clickTab(e, TABS.PREFERENCES)} styleName={settingsTab === TABS.PREFERENCES ? 'active-tab' : 'tab'}>
Preferences
        </a>
      </div>
    </div>
  );
}

Header.propTypes = {
  settingsTab: PT.string.isRequired,
  selectTab: PT.func.isRequired,
};
