/**
 * Child component of Settings/Account renders setting page for account.
 */
/* eslint-disable no-undef */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import Accordion from 'components/Settings/Accordion';
import MyAccountIcon from 'assets/images/account/sideicons/myaccount.svg';
import LinkedAccountIcon from 'assets/images/account/sideicons/linkedaccount.svg';
import ErrorWrapper from 'components/Settings/ErrorWrapper';
import SideBar from '../SideBar';
import ComingSoon from '../ComingSoon';
import MyAccount from './MyAccount';
import LinkedAccount from './LinkedAccount';
import { SCREEN_SIZE } from '../constants';
import './styles.scss';

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    const hash = decodeURIComponent(_.get(props, 'location.hash', '').substring(1));
    this.tablink = hash.replace('-', ' ');
    const { toggleAccountSideTab } = this.props;
    if (this.tablink) {
      toggleAccountSideTab(this.tablink);
    }
    this.state = {
      isMobileView: false,
    };
    this.clearNotifiation = this.clearNotifiation.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);
  }

  componentDidMount() {
    this.clearNotifiation();
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
  }

  componentDidUpdate(prevProps) {
    const { settingsUI: { currentAccountTab } } = this.props;
    if (prevProps.settingsUI.currentAccountTab !== currentAccountTab) {
      window.location.hash = currentAccountTab.replace(' ', '-');
      this.clearNotifiation();
    }
  }

  componentWillUnmount() {
    this.clearNotifiation();
    window.removeEventListener('resize', this.updatePredicate);
  }

  clearNotifiation() {
    const { clearToastrNotification } = this.props;
    if (clearToastrNotification) {
      clearToastrNotification();
    }
  }

  updatePredicate() {
    this.setState({ isMobileView: window.innerWidth <= SCREEN_SIZE.SM });
  }

  render() {
    const {
      settingsUI,
      toggleAccountSideTab,
    } = this.props;
    const { isMobileView } = this.state;
    const tabs = settingsUI.TABS.ACCOUNT;
    const names = Object.keys(tabs).map(key => tabs[key]);
    const currentTab = this.tablink || settingsUI.currentAccountTab;
    const icons = {
      'my account': <MyAccountIcon />,
      'linked accounts': <LinkedAccountIcon />,
    };
    const renderTabContent = (tab) => {
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
        {isMobileView && (
          <div styleName="mobile-view">
            <Accordion
              icons={icons}
              names={names}
              currentSidebarTab={currentTab}
              renderTabContent={renderTabContent}
              toggleSidebarTab={toggleAccountSideTab}
            />
          </div>
        )}
        <div styleName="col-bar">
          <SideBar
            icons={icons}
            names={names}
            currentTab={currentTab}
            toggle={toggleAccountSideTab}
          />
        </div>
        {
          !isMobileView && (
          <div styleName="col-content">
            <ErrorWrapper>
              { renderTabContent(currentTab) }
            </ErrorWrapper>
          </div>
          )
        }
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
