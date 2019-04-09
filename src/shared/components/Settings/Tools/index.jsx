/**
 * Child component of Settings/Tools renders setting page for tools.
 */
/* eslint-disable no-undef */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import Accordion from 'components/Settings/Accordion';
import SideBar from 'components/Settings/SideBar';
import DevicesIcon from 'assets/images/tools/sideicons/devices.svg';
import ServiceProvidersIcon from 'assets/images/tools/sideicons/serviceproviders.svg';
import SoftwareIcon from 'assets/images/tools/sideicons/software.svg';
import SubscriptionsIcon from 'assets/images/tools/sideicons/subscriptions.svg';
import Devices from 'components/Settings/Tools/Devices';
import ComingSoon from 'components/Settings/ComingSoon';
import Software from 'components/Settings/Tools/Software';
import ServiceProviders from 'components/Settings/Tools/ServiceProviders';
import Subscriptions from 'components/Settings/Tools/Subscriptions';
import ErrorWrapper from 'components/Settings/ErrorWrapper';
import { SCREEN_SIZE } from '../constants';

import './styles.scss';

export default class Tools extends React.Component {
  constructor(props) {
    super(props);
    const hash = decodeURIComponent(_.get(props, 'location.hash', '').substring(1));
    this.tablink = hash.replace('-', ' ');
    const { toggleToolsSideTab } = this.props;
    if (this.tablink) {
      toggleToolsSideTab(this.tablink);
    }
    this.state = {
      isMobileView: false,
    };
    this.clearNotifiation = this.clearNotifiation.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { settingsUI: { currentToolsTab } } = this.props;
    if (prevProps.settingsUI.currentToolsTab !== currentToolsTab) {
      window.location.hash = currentToolsTab.replace(' ', '-');
      this.clearNotifiation();
    }
  }

  componentDidMount() {
    this.clearNotifiation();
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
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
    const { isMobileView } = this.state;
    const {
      settingsUI: { currentToolsTab, TABS },
      toggleToolsSideTab,
    } = this.props;
    const tabs = TABS.TOOLS;
    const names = Object.keys(tabs).map(key => tabs[key]);
    const currentTab = this.tablink || currentToolsTab;

    const icons = {
      devices: <DevicesIcon />,
      'service providers': <ServiceProvidersIcon />,
      software: <SoftwareIcon />,
      subscriptions: <SubscriptionsIcon />,
    };

    const renderTabContent = (tab) => {
      switch (tab) {
        case 'devices':
          return <Devices {...this.props} />;
        case 'software':
          return <Software {...this.props} />;
        case 'service providers':
          return <ServiceProviders {...this.props} />;
        case 'subscriptions':
          return <Subscriptions {...this.props} />;
        default:
          return <ComingSoon />;
      }
    };

    return (
      <div styleName="tools-container">
        {isMobileView && (
          <div styleName="mobile-view">
            <Accordion
              icons={icons}
              names={names}
              currentSidebarTab={currentTab}
              renderTabContent={renderTabContent}
              toggleSidebarTab={toggleToolsSideTab}
            />
          </div>
        )}
        <div styleName="col-bar">
          <ErrorWrapper>
            <SideBar
              icons={icons}
              names={names}
              currentTab={currentTab}
              toggle={toggleToolsSideTab}
            />
          </ErrorWrapper>
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


Tools.propTypes = {
  settingsUI: PT.shape().isRequired,
  toggleToolsSideTab: PT.func.isRequired,
  clearToastrNotification: PT.func.isRequired,
  location: PT.shape().isRequired,
};
