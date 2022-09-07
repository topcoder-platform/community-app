/**
 * Child component of Settings
 * Preferences renders setting page for user preferences.
 */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
import React from 'react';
import PT from 'prop-types';
import { config } from 'topcoder-react-utils';

import Accordion from 'components/Settings/Accordion';
import LoadingIndicator from 'components/LoadingIndicator';
import EmailIcon from 'assets/images/preferences/email.svg';
import Forum from 'assets/images/preferences/forum.svg';
import Payment from 'assets/images/preferences/payment.svg';
import SideBar from 'components/Settings/SideBar';
import ErrorWrapper from 'components/Settings/ErrorWrapper';
import NewsletterPreferencesContainer from 'containers/NewsletterPreferences';
import { SCREEN_SIZE } from '../constants';

import './styles.scss';

const tabs = {
  EMAIL: 'e-mail',
  FORUM: 'forum',
  PAYMENT: 'payment',
};

const icons = {
  'e-mail': <EmailIcon />,
  forum: <Forum />,
  payment: <Payment />,
};

export default class Preferences extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'e-mail',
      isMobileView: false,
    };
    this.previousTab = null;
    this.toggleTab = this.toggleTab.bind(this);
    this.renderTabContent = this.renderTabContent.bind(this);
    this.clearNotifiation = this.clearNotifiation.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);
  }

  componentDidMount() {
    this.clearNotifiation();
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
  }

  componentDidUpdate() {
    const { currentTab } = this.state;
    if (currentTab !== this.previousTab) {
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

  /* Add this to resolve checkbox checked issue when switch mobile to other device */
  toggleTab(tab) {
    const { currentTab } = this.state;
    this.previousTab = currentTab;
    this.setState({ currentTab: tab });
  }

  renderTabContent(tab) {
    const { profile: { email } } = this.props;
    switch (tab) {
      case 'e-mail':
        return <NewsletterPreferencesContainer email={email} />;
      case 'forum':
        return (window.location.href = `${config.URL.FORUMS_VANILLA}/profile/preferences`) && <LoadingIndicator />;
      case 'payment':
        return (window.location.href = `${config.URL.COMMUNITY}/PactsMemberServlet?module=PaymentHistory&full_list=false&ref=nav`) && <LoadingIndicator />;
      default:
        return null;
    }
  }

  render() {
    const {
      currentTab,
      isMobileView,
    } = this.state;

    const names = Object.keys(tabs).map(key => tabs[key]);

    return (
      <div styleName="preferences-container">
        {isMobileView && (
          <div styleName="mobile-view">
            <Accordion
              icons={icons}
              names={names}
              currentSidebarTab={currentTab}
              renderTabContent={this.renderTabContent}
              toggleSidebarTab={this.toggleTab}
            />
          </div>
        )}
        <div styleName="col-bar">
          <SideBar
            icons={icons}
            names={names}
            currentTab={currentTab}
            toggle={this.toggleTab}
          />
        </div>
        {
          !isMobileView && (
          <div styleName="col-content">
            <ErrorWrapper>
              { this.renderTabContent(currentTab) }
            </ErrorWrapper>
          </div>
          )
        }
      </div>
    );
  }
}

Preferences.propTypes = {
  clearToastrNotification: PT.func.isRequired,
  profile: PT.shape().isRequired,
};
