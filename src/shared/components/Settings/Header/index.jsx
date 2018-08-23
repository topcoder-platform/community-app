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
    <div styleName="Header">
      <div styleName="title">
        <h1>
Settings
        </h1>
      </div>
      <nav styleName="tabs">
        <ul>
          <li>
            <a
              role="link"
              tabIndex={0}
              onKeyPress={e => clickTab(e, TABS.PROFILE)}
              onClick={e => clickTab(e, TABS.PROFILE)}
              styleName={settingsTab === TABS.PROFILE ? 'active-tab' : ''}
            >
              Profile
            </a>
          </li>
          <li>
            <a
              role="link"
              tabIndex={0}
              onKeyPress={e => clickTab(e, TABS.TOOLS)}
              onClick={e => clickTab(e, TABS.TOOLS)}
              styleName={settingsTab === TABS.TOOLS ? 'active-tab' : ''}
            >
              Tools
            </a>
          </li>
          <li>
            <a
              role="link"
              tabIndex={0}
              onKeyPress={e => clickTab(e, TABS.ACCOUNT)}
              onClick={e => clickTab(e, TABS.ACCOUNT)}
              styleName={settingsTab === TABS.ACCOUNT ? 'active-tab' : ''}
            >
              Account
            </a>
          </li>
          <li>
            <a
              role="link"
              tabIndex={0}
              onKeyPress={e => clickTab(e, TABS.PREFERENCES)}
              onClick={e => clickTab(e, TABS.PREFERENCES)}
              styleName={settingsTab === TABS.PREFERENCES ? 'active-tab' : ''}
            >
              Preferences
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

Header.propTypes = {
  settingsTab: PT.string.isRequired,
  selectTab: PT.func.isRequired,
};
