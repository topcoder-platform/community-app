/**
 * Child component of Settings/Tools renders setting page for tools.
 */
import React from 'react';
import PT from 'prop-types';

import Accordion from 'components/Settings/Accordion';
import SideBar from 'components/Settings/SideBar';
import DevicesIcon from 'assets/images/tools/sideicons/devices.svg';
import ServiceProvidersIcon from 'assets/images/tools/sideicons/serviceproviders.svg';
import SoftwareIcon from 'assets/images/tools/sideicons/software.svg';
import SubscriptionsIcon from 'assets/images/tools/sideicons/subscriptions.svg';
import Devices from './Devices';
import ComingSoon from '../ComingSoon';
import Software from './Software';
import ServiceProviders from './ServiceProviders';
import Subscriptions from './Subscriptions';
import ErrorWrapper from 'components/Settings/ErrorWrapper';

import './styles.scss';

class Tools extends React.Component {
  constructor(props) {
    super(props);
    this.previousSelectedTab = null;

    this.state = {
      isMobileView: false,
      screenSM: 767,
    };
    this.updatePredicate = this.updatePredicate.bind(this);
  }

  componentDidMount() {
    const {
      clearToastrNotification,
    } = this.props;
    clearToastrNotification();

    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
  }

  componentWillUnmount() {
    const {
      clearToastrNotification,
    } = this.props;
    clearToastrNotification();
    window.removeEventListener('resize', this.updatePredicate);
  }

  updatePredicate() {
    const { screenSM } = this.state;
    this.setState({ isMobileView: window.innerWidth <= screenSM });
  }

  render() {
    const { isMobileView } = this.state;
    const {
      settingsUI: { currentToolsTab, TABS },
      toggleToolsSideTab,
      clearToastrNotification,
    } = this.props;
    const tabs = TABS.TOOLS;
    const names = Object.keys(tabs).map(key => tabs[key]);
    const currentTab = currentToolsTab;

    const icons = {
      devices: <DevicesIcon />,
      'service providers': <ServiceProvidersIcon />,
      software: <SoftwareIcon />,
      subscriptions: <SubscriptionsIcon />,
    };

  const renderTabContent = (tab) => {
    if (this.previousSelectedTab !== tab) {
      clearToastrNotification();
    }
    
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
      <div styleName="mobile-view">
        <Accordion
          icons={icons}
          names={names}
          currentSidebarTab={currentTab}
          renderTabContent={renderTabContent}
          toggleSidebarTab={toggleToolsSideTab}
        />
      </div>
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
      <div styleName="col-content">
        <ErrorWrapper>
          { renderTabContent(currentTab) }
        </ErrorWrapper>
      </div>
    </div>
  );
  }
}

Tools.propTypes = {
  settingsUI: PT.shape().isRequired,
  toggleToolsSideTab: PT.func.isRequired,
  clearToastrNotification: PT.func.isRequired,
};

export default Tools;