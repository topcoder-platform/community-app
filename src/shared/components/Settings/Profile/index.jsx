/**
 * Child component of Settings/Profile renders setting page for profile.
 */
import React from 'react';
import PT from 'prop-types';

import Accordion from 'components/Settings/Accordion';
import SideBar from 'components/Settings/SideBar';
import Info from 'assets/images/profile/sideicons/basicinfo.svg';
import Language from 'assets/images/profile/sideicons/language.svg';
import Education from 'assets/images/profile/sideicons/education.svg';
import Work from 'assets/images/profile/sideicons/work.svg';
import Organization from 'assets/images/profile/sideicons/organization.svg';
import Skill from 'assets/images/profile/sideicons/skill.svg';
import Hobby from 'assets/images/profile/sideicons/hobby.svg';
import Community from 'assets/images/profile/sideicons/community.svg';
import BasicInfo from './BasicInfo';

import './styles.scss';

export default function Profile(props) {
  const tabs = props.settingsUI.TABS.PROFILE;
  const names = Object.keys(tabs).map(key => tabs[key]);
  const currentTab = props.settingsUI.currentProfileTab;

  const icons = {
    'basic info': <Info />,
    language: <Language />,
    education: <Education />,
    work: <Work />,
    organization: <Organization />,
    skill: <Skill />,
    hobby: <Hobby />,
    community: <Community />,
  };

  const renderTabContent = (tab) => {
    switch (tab) {
      case 'basic info':
        return <BasicInfo {...props} />;
      default:
        return null;
    }
  };

  return (
    <div styleName="profile-container">
      <div styleName="mobile-view">
        <Accordion
          icons={icons}
          names={names}
          currentSidebarTab={currentTab}
          renderTabContent={renderTabContent}
          toggleSidebarTab={props.toggleProfileSideTab}
        />
      </div>
      <div styleName="col-bar">
        <SideBar
          icons={icons}
          names={names}
          currentTab={currentTab}
          toggle={props.toggleProfileSideTab}
        />
      </div>
      <div styleName="col-content">
        { renderTabContent(currentTab) }
      </div>
    </div>
  );
}
Profile.propTypes = {
  settingsUI: PT.shape().isRequired,
  toggleProfileSideTab: PT.func.isRequired,
};
