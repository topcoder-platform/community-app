/**
 * Child component of Settings/Profile renders setting page for profile.
 */
import React from 'react';
import PT from 'prop-types';


import SideBar from '../SideBar';
import sideIcons from './SideIcons';
import BasicInfo from './BasicInfo';


import './styles.scss';

export default function Profile(props) {
  const tabs = props.settingsUI.TABS.PROFILE;
  const names = Object.keys(tabs).map(key => tabs[key]);
  const currentTab = props.settingsUI.currentProfileTab;
  return (
    <div styleName="profile-container">
      <div styleName="col-bar">
        <SideBar
          icons={sideIcons}
          names={names}
          currentTab={currentTab}
          toggle={props.toggleProfileSideTab}
        />
      </div>
      <div styleName="col-content">
        <BasicInfo
          {...props}
        />
      </div>
    </div>
  );
}
Profile.propTypes = {
  settingsUI: PT.shape().isRequired,
  toggleProfileSideTab: PT.func.isRequired,
};

