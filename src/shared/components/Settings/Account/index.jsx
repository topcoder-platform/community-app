/**
 * Child component of Settings/Account renders setting page for account.
 */

import React from 'react';
import PT from 'prop-types';
import { isomorphy } from 'topcoder-react-utils';
import SideBar from '../SideBar';
import ComingSoon from '../ComingSoon';
import MyAccount from './MyAccount';
import LinkedAccount from './LinkedAccount';


import './styles.scss';

export default function Account(props) {
  const {
    settingsUI,
    toggleAccountSideTab,
  } = props;
  const tabs = settingsUI.TABS.ACCOUNT;
  const names = Object.keys(tabs).map(key => tabs[key]);
  const currentTab = settingsUI.currentAccountTab;

  let assets;
  const sideIcons = {};
  if (isomorphy.isClientSide()) {
    assets = require.context('assets/images/account/sideicons', false, /svg/);

    if (assets) {
      names.forEach((name) => {
        sideIcons[name] = assets(`./${name}.svg`);
      });
    }
  }

  const renderView = () => {
    switch (currentTab) {
      case 'my account':
        return <MyAccount {...props} />;
      case 'linked account':
        return <LinkedAccount {...props} />;
      default:
        return <ComingSoon />;
    }
  };

  return (
    <div styleName="account-container">
      <div styleName="col-bar">
        <SideBar
          icons={sideIcons}
          names={names}
          currentTab={currentTab}
          toggle={toggleAccountSideTab}
        />
      </div>
      <div styleName="col-content">
        {renderView()}
      </div>
    </div>
  );
}

Account.propTypes = {
  settingsUI: PT.shape().isRequired,
  toggleAccountSideTab: PT.func.isRequired,
};
