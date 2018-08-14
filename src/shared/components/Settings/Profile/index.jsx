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
import BasicInfo from './BasicInfo';
import Language from './Language';
import Education from './Education';
import Work from './Work';
import Skills from './Skills';
import Community from './Community';
import ComingSoon from '../ComingSoon';

import './styles.scss';

class Profile extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isMobileView: false,
      screenSM: 768,
    };

    this.updatePredicate = this.updatePredicate.bind(this);
  }

  /* Add this to resolve checkbox checked issue when switch mobile to other device */
  componentDidMount() {
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePredicate);
  }

  updatePredicate() {
    const { screenSM } = this.state;
    this.setState({ isMobileView: window.innerWidth <= screenSM });
  }
  /* end */

  render() {
    const { isMobileView } = this.state;

    const {
      settingsUI: { currentProfileTab, TABS },
      toggleProfileSideTab,
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
      skill: <SkillIcon />,
      hobby: <HobbyIcon />,
      community: <CommunityIcon />,
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
        case 'skill':
          return <Skills {...this.props} />;
        case 'community':
          return <Community {...this.props} />;
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
          <SideBar
            icons={icons}
            names={names}
            currentTab={currentTab}
            toggle={toggleProfileSideTab}
          />
        </div>
        {
          !isMobileView && (
            <div styleName="col-content">
              { renderTabContent(currentTab) }
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
};

export default Profile;
