/**
 * Child component of Settings/Profile renders setting page for profile.
 */
import React from 'react';
import PT from 'prop-types';

import SideBar from '../SideBar';
import sideIcons from './SideIcons';
import BasicInfo from './BasicInfo';
import ComingSoon from '../ComingSoon';

import './styles.scss';

export default function Profile(props) {
  const {
    settingsUI,
    toggleProfileSideTab,
  } = props;
  const tabs = settingsUI.TABS.PROFILE;
  const names = Object.keys(tabs).map(key => tabs[key]);
  const currentTab = settingsUI.currentProfileTab;

  const renderView = () => {
    switch (currentTab) {
      case 'basic info':
        return <BasicInfo {...props} />;
      default:
        return <ComingSoon />;
    }
  };

  return (
    <div styleName="profile-container">
      <div styleName="col-bar">
        <SideBar
          icons={sideIcons}
          names={names}
          currentTab={currentTab}
          toggle={toggleProfileSideTab}
        />
      </div>
      <div styleName="col-content">
        {renderView()}
      </div>
    </div>
  );
}
Profile.propTypes = {
  settingsUI: PT.shape().isRequired,
  toggleProfileSideTab: PT.func.isRequired,
};
