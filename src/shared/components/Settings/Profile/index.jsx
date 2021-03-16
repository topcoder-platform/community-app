/**
 * Child component of Settings/Profile renders setting page for profile.
 */

import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';

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
import { SCREEN_SIZE } from '../constants';


import './styles.scss';

class Profile extends React.Component {
  constructor(props) {
    super(props);

    const hash = decodeURIComponent(_.get(props, 'location.hash', '').substring(1));
    this.tablink = hash.replace('-', ' ');
    const { toggleProfileSideTab } = this.props;
    if (this.tablink) {
      toggleProfileSideTab(this.tablink);
    }
    this.state = {
      isMobileView: false,
    };
    this.clearNotifiation = this.clearNotifiation.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);
  }

  componentDidMount() {
    this.clearNotifiation();
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
  }

  componentDidUpdate(prevProps) {
    const { settingsUI: { currentProfileTab } } = this.props;
    if (prevProps.settingsUI.currentProfileTab !== currentProfileTab) {
      window.location.hash = currentProfileTab.replace(' ', '-');
      this.clearNotifiation();
    }
  }

  componentWillUnmount() {
    this.clearNotifiation();
    window.removeEventListener('resize', this.updatePredicate);
  }

  clearNotifiation() {
    const { clearToastrNotification } = this.props;
    if (clearToastrNotification) {
      clearToastrNotification();
    }
  }

  updatePredicate() {
    this.setState({ isMobileView: window.innerWidth <= SCREEN_SIZE.SM });
  }

  render() {
    const { isMobileView } = this.state;
    const {
      settingsUI: { currentProfileTab, TABS },
      toggleProfileSideTab,
    } = this.props;
    const tabs = TABS.PROFILE;
    const names = Object.keys(tabs).map(key => tabs[key]);
    const currentTab = this.tablink || currentProfileTab;

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
  location: PT.shape().isRequired,
};

export default Profile;
