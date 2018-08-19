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
import Devices from 'components/Settings/Tools/Devices';
import ComingSoon from 'components/Settings/ComingSoon';
import Software from 'components/Settings/Tools/Software';
import ServiceProviders from 'components/Settings/Tools/ServiceProviders';
import Subscriptions from 'components/Settings/Tools/Subscriptions';

import './styles.scss';

export default function Tools(props) {
  const {
    settingsUI: { currentToolsTab, TABS },
    toggleToolsSideTab,
  } = props;
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
    switch (tab) {
      case 'devices':
        return <Devices {...props} />;
      case 'software':
        return <Software {...props} />;
      case 'service providers':
        return <ServiceProviders {...props} />;
      case 'subscriptions':
        return <Subscriptions {...props} />;
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
        <SideBar
          icons={icons}
          names={names}
          currentTab={currentTab}
          toggle={toggleToolsSideTab}
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
