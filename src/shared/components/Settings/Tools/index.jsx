/**
 * Child component of Settings/Tools renders setting page for tools.
 */
import React from 'react';
import PT from 'prop-types';
import Accordion from 'components/Settings/Accordion';
import SideBar from 'components/Settings/SideBar';
import Devices from 'assets/images/tools/sideicons/devices.svg';
import ServiceProviders from 'assets/images/tools/sideicons/serviceproviders.svg';
import SoftwareIcon from 'assets/images/tools/sideicons/software.svg';
import Subscriptions from 'assets/images/tools/sideicons/subscriptions.svg';
import Device from './Devices';
import Software from './Software';

import './styles.scss';

export default function Tools(props) {
  const tabs = props.settingsUI.TABS.TOOLS;
  const names = Object.keys(tabs).map(key => tabs[key]);
  const currentTab = props.settingsUI.currentToolsTab;

  const icons = {
    devices: <Devices />,
    'service providers': <ServiceProviders />,
    software: <SoftwareIcon />,
    subscriptions: <Subscriptions />,
  };

  const renderTabContent = (tab) => {
    switch (tab) {
      case 'devices':
        return <Device {...props} />;
      case 'software':
        return <Software {...props} />;
      default:
        return null;
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
          toggleSidebarTab={props.toggleToolsSideTab}
        />
      </div>
      <div styleName="col-bar">
        <SideBar
          icons={icons}
          names={names}
          currentTab={currentTab}
          toggle={props.toggleToolsSideTab}
        />
      </div>
      <div styleName="col-content">
        { renderTabContent(currentTab) }
      </div>
    </div>
  );
}

Tools.propTypes = {
  settingsUI: PT.shape().isRequired,
  toggleToolsSideTab: PT.func.isRequired,
};
