/**
 * Child component of Settings/Profile renders setting page for profile.
 */
/* eslint-disable no-undef */
import React from 'react';
import PT from 'prop-types';

import Accordion from 'components/Settings/Accordion';
import SideBar from 'components/Settings/SideBar';
import InfoIcon from 'assets/images/profile/sideicons/basicinfo.svg';
import LanguageIcon from 'assets/images/profile/sideicons/language.svg';
import EducationIcon from 'assets/images/profile/sideicons/education.svg';
import WorkIcon from 'assets/images/profile/sideicons/work.svg';
import OrganizationIcon from 'assets/images/profile/sideicons/organization.svg';
import SkillIcon from 'assets/images/profile/sideicons/skill.svg';
import HobbyIcon from 'assets/images/profile/sideicons/hobby.svg';
import CommunityIcon from 'assets/images/profile/sideicons/community.svg';
import ErrorWrapper from 'components/Settings/ErrorWrapper';
import BasicInfo from './BasicInfo';
import Language from './Language';
import Education from './Education';
import Work from './Work';
import Skills from './Skills';
import Community from './Community';
import Organization from './Organization';
import Hobby from './Hobby';
import ComingSoon from '../ComingSoon';


import './styles.scss';

class Profile extends React.Component {
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
      settingsUI: { currentProfileTab, TABS },
      toggleProfileSideTab,
      clearToastrNotification,
    } = this.props;
    const tabs = TABS.PROFILE;
    const names = Object.keys(tabs).map(key => tabs[key]);
    const currentTab = currentProfileTab;

    const icons = {
      'basic info': <InfoIcon />,
      language: <LanguageIcon />,
      education: <EducationIcon />,
      work: <WorkIcon />,
      organization: <OrganizationIcon />,
      skills: <SkillIcon />,
      hobbies: <HobbyIcon />,
      communities: <CommunityIcon />,
    };

    const renderTabContent = (tab) => {
      if (this.previousSelectedTab !== tab) {
        clearToastrNotification();
      }
      this.previousSelectedTab = tab;
      switch (tab) {
        case 'basic info':
          return <BasicInfo {...this.props} />;
        case 'language':
          return <Language {...this.props} />;
        case 'education':
          return <Education {...this.props} />;
        case 'work':
          return <Work {...this.props} />;
        case 'skills':
          return <Skills {...this.props} />;
        case 'communities':
          return <Community {...this.props} />;
        case 'organization':
          return <Organization {...this.props} />;
        case 'hobbies':
          return <Hobby {...this.props} />;
        default:
          return <ComingSoon />;
      }
    };
    return (
      <div styleName="profile-container">
        {
          isMobileView && (
            <Accordion
              icons={icons}
              names={names}
              currentSidebarTab={currentTab}
              renderTabContent={renderTabContent}
              toggleSidebarTab={toggleProfileSideTab}
            />
          )
        }
        <div styleName="col-bar">
          <ErrorWrapper>
            <SideBar
              icons={icons}
              names={names}
              currentTab={currentTab}
              toggle={toggleProfileSideTab}
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

Profile.propTypes = {
  settingsUI: PT.shape().isRequired,
  toggleProfileSideTab: PT.func.isRequired,
  clearToastrNotification: PT.func.isRequired,
  countries: PT.arrayOf({
    PT.shape({key: PT.string, name: PT.string})
  }).isRequired,
};

export default Profile;
