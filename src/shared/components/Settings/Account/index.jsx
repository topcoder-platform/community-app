/**
 * Child component of Settings/Account renders setting page for account.
 */

import React from 'react';
import PT from 'prop-types';
import Accordion from 'components/Settings/Accordion';
import MyAccountIcon from 'assets/images/account/sideicons/myaccount.svg';
import LinkedAccountIcon from 'assets/images/account/sideicons/linkedaccount.svg';
import ErrorWrapper from 'components/Settings/ErrorWrapper';
import SideBar from '../SideBar';
import ComingSoon from '../ComingSoon';
import MyAccount from './MyAccount';
import LinkedAccount from './LinkedAccount';

import './styles.scss';

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    const hash = decodeURIComponent(props.location.hash.substring(1));
    this.tablink = hash.replace('-', ' ');
    const { toggleAccountSideTab } = this.props;
    if (this.tablink) {
      toggleAccountSideTab(this.tablink);
    }
  }

  componentDidUpdate(prevProps) {
    const { settingsUI: { currentAccountTab } } = this.props;
    if (prevProps.settingsUI.currentAccountTab !== currentAccountTab) {
      window.location.hash = currentAccountTab.replace(' ', '-');
    }
  }

  render() {
    const {
      settingsUI,
      toggleAccountSideTab,
      clearToastrNotification,
    } = this.props;
    const tabs = settingsUI.TABS.ACCOUNT;
    const names = Object.keys(tabs).map(key => tabs[key]);
    const currentTab = this.tablink || settingsUI.currentAccountTab;

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
          return <MyAccount {...this.props} />;
        case 'linked accounts':
          return <LinkedAccount {...this.props} />;
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
          <ErrorWrapper>
            { renderTabContent(currentTab) }
          </ErrorWrapper>
        </div>
      </div>
    );
  }
}

Account.propTypes = {
  settingsUI: PT.shape().isRequired,
  toggleAccountSideTab: PT.func.isRequired,
  clearToastrNotification: PT.func.isRequired,
  location: PT.shape().isRequired,
};
