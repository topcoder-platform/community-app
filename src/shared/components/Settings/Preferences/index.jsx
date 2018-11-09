/**
 * Child component of Settings
 * Preferences renders setting page for user preferences.
 */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
import React from 'react';
import { config } from 'topcoder-react-utils';

import Accordion from 'components/Settings/Accordion';
import LoadingIndicator from 'components/LoadingIndicator';
import EmailIcon from 'assets/images/preferences/email.svg';
import Forum from 'assets/images/preferences/forum.svg';
import Invletter from 'assets/images/preferences/invletter.svg';
import Payment from 'assets/images/preferences/payment.svg';
import PersonalizationIcon from 'assets/images/preferences/personalization.svg';
import Referral from 'assets/images/preferences/referral.svg';
import SideBar from 'components/Settings/SideBar';
import Email from './Email';
import Personalization from './Personalization';

import './styles.scss';

const tabs = {
  EMAIL: 'e-mail',
  FORUM: 'forum',
  PAYMENT: 'payment',
  LETTER: 'invitation letter',
  REFERRALS: 'referrals',
  PERSONALIZATION: 'personalization',
};

const icons = {
  'e-mail': <EmailIcon />,
  forum: <Forum />,
  payment: <Payment />,
  'invitation letter': <Invletter />,
  referrals: <Referral />,
  personalization: <PersonalizationIcon />,
};

export default class Preferences extends React.Component {
  constructor(props) {
    super(props);

    this.toggleTab = this.toggleTab.bind(this);
    this.renderTabContent = this.renderTabContent.bind(this);

    this.state = {
      currentTab: 'e-mail',
    };
  }

  toggleTab(tab) {
    this.setState({ currentTab: tab });
  }

  renderTabContent(tab) {
    switch (tab) {
      case 'e-mail':
        return <Email {...this.props} />;
      case 'forum':
        return (window.location.href = `${config.URL.FORUMS}/?module=Settings`) && <LoadingIndicator />;
      case 'payment':
        return (window.location.href = `${config.URL.COMMUNITY}/tc?module=EditPaymentPreferences`) && <LoadingIndicator />;
      case 'invitation letter':
        return (window.location.href = `${config.URL.COMMUNITY}/tc?module=VisaSelection`) && <LoadingIndicator />;
      case 'referrals':
        return (window.location.href = `${config.URL.COMMUNITY}/tc?module=ViewReferrals`) && <LoadingIndicator />;
      case 'personalization':
        return <Personalization {...this.props} />;
      default:
        return null;
    }
  }

  render() {
    const {
      currentTab,
    } = this.state;

    const names = Object.keys(tabs).map(key => tabs[key]);

    return (
      <div styleName="preferences-container">
        <div styleName="mobile-view">
          <Accordion
            icons={icons}
            names={names}
            currentSidebarTab={currentTab}
            renderTabContent={this.renderTabContent}
            toggleSidebarTab={this.toggleTab}
          />
        </div>
        <div styleName="col-bar">
          <SideBar
            icons={icons}
            names={names}
            currentTab={currentTab}
            toggle={this.toggleTab}
          />
        </div>
        <div styleName="col-content">
          { this.renderTabContent(currentTab) }
        </div>
      </div>
    );
  }
}
