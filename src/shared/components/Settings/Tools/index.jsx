/**
 * Child component of Settings/Tools renders setting page for tools.
 */

import React from 'react';
import PT from 'prop-types';
import { isomorphy } from 'topcoder-react-utils';
import SideBar from '../SideBar';
import Device from './Devices';
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
        <Device
          {...props}
        />
        <Software
          {...props}
        />
      </div>
    </div>
  );
}

Tools.propTypes = {
  settingsUI: PT.shape().isRequired,
  toggleToolsSideTab: PT.func.isRequired,
};
