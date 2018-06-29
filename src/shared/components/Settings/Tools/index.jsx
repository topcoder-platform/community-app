/**
 * Child component of Settings/Tools renders setting page for tools.
 */

import React from 'react';
import PT from 'prop-types';
import { isomorphy } from 'topcoder-react-utils';
import SideBar from '../SideBar';
import Devices from './Devices';
import ComingSoon from '../ComingSoon';
import Software from './Software';

import './styles.scss';

export default function Tools(props) {
  const {
    settingsUI,
    toggleToolsSideTab,
  } = props;
  const tabs = settingsUI.TABS.TOOLS;
  const names = Object.keys(tabs).map(key => tabs[key]);
  const currentTab = settingsUI.currentToolsTab;

  let assets;
  const sideIcons = {};
  if (isomorphy.isClientSide()) {
    assets = require.context('assets/images/tools/sideicons', false, /svg/);

    if (assets) {
      names.forEach((name) => {
        sideIcons[name] = assets(`./${name}.svg`);
      });
    }
  }

  const renderView = () => {
    switch (currentTab) {
      case 'devices':
        return <Devices {...props} />;
      case 'software':
        return <Software {...props} />;
      default:
        return <ComingSoon />;
    }
  };

  return (
    <div styleName="tools-container">
      <div styleName="col-bar">
        <SideBar
          icons={sideIcons}
          names={names}
          currentTab={currentTab}
          toggle={toggleToolsSideTab}
        />
      </div>
      <div styleName="col-content">
        {renderView()}
      </div>
    </div>
  );
}

Tools.propTypes = {
  settingsUI: PT.shape().isRequired,
  toggleToolsSideTab: PT.func.isRequired,
};
