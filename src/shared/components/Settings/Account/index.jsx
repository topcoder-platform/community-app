/**
 * Child component of Settings/Account renders setting page for account.
 */

import React from 'react';
import PT from 'prop-types';
import Accordion from 'components/Settings/Accordion';
import MyAccountIcon from 'assets/images/account/sideicons/myaccount.svg';
import LinkedAccountIcon from 'assets/images/account/sideicons/linkedaccount.svg';
import SideBar from '../SideBar';
import ComingSoon from '../ComingSoon';
import MyAccount from './MyAccount';
import LinkedAccount from './LinkedAccount';

import './styles.scss';

export default function Account(props) {
  const {
    settingsUI,
    toggleAccountSideTab,
    clearToastrNotification,
  } = props;
  const tabs = settingsUI.TABS.ACCOUNT;
  const names = Object.keys(tabs).map(key => tabs[key]);
  const currentTab = settingsUI.currentAccountTab;

  const icons = {
    'my account': <MyAccountIcon />,
    'linked accounts': <LinkedAccountIcon />,
  };
  let previousSelectedTab = null;
  const renderTabContent = (tab) => {
    if (previousSelectedTab !== tab && clearToastrNotification) {
      clearToastrNotification();
    }
    previousSelectedTab = tab;
    switch (tab) {
      case 'my account':
        return <MyAccount {...props} />;
      case 'linked accounts':
        return <LinkedAccount {...props} />;
      default:
        return <ComingSoon />;
    }
  };

  return (
    <div styleName="account-container">
      <div styleName="mobile-view">
        <Accordion
          icons={icons}
          names={names}
          currentSidebarTab={currentTab}
          renderTabContent={renderTabContent}
          toggleSidebarTab={toggleAccountSideTab}
        />
      </div>
      <div styleName="col-bar">
        <SideBar
          icons={icons}
          names={names}
          currentTab={currentTab}
          toggle={toggleAccountSideTab}
        />
      </div>
      <div styleName="col-content">
        { renderTabContent(currentTab) }
      </div>
    </div>
  );
}

Account.propTypes = {
  settingsUI: PT.shape().isRequired,
  toggleAccountSideTab: PT.func.isRequired,
  clearToastrNotification: PT.func.isRequired,
};
