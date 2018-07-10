/**
 * Child component of Settings/TabBar renders bar for 4 tabs.
 */
import React from 'react';
import PT from 'prop-types';

import { PROFILETABS } from 'actions/page/profileSettings';
import BasicInfo from '../../../../../assets/images/profileNavbar/basicinfo.svg';
import Community from '../../../../../assets/images/profileNavbar/community.svg';
import Education from '../../../../../assets/images/profileNavbar/education.svg';
import Hobby from '../../../../../assets/images/profileNavbar/hobby.svg';
import Language from '../../../../../assets/images/profileNavbar/language.svg';
import Organization from '../../../../../assets/images/profileNavbar/organization.svg';
import Skill from '../../../../../assets/images/profileNavbar/skill.svg';
import Work from '../../../../../assets/images/profileNavbar/work.svg';

import './styles.scss';

export default function ProfileSubtabs(props) {
  const {
    subTab,
    selectTab
  } = props;

  const clickTab = (e, tab) => {
    e.preventDefault();
    setImmediate(() => {
      selectTab(tab);
    });
  };
  // 
  return (
    <nav>
      <ul>
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.BASICINFO)} onClick={e => clickTab(e, PROFILETABS.BASICINFO)} styleName={subTab === PROFILETABS.BASICINFO ? 'tab activeTab': 'tab'}><BasicInfo /><span style= {{marginLeft: "14px"}}>Basic Info</span></a></li>
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.LANGUAGE)} onClick={e => clickTab(e, PROFILETABS.LANGUAGE)} styleName={subTab === PROFILETABS.LANGUAGE ? 'tab activeTab': 'tab'}><Language /><span style= {{marginLeft: "14px"}}>Language</span></a></li>
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.EDUCATION)} onClick={e => clickTab(e, PROFILETABS.EDUCATION)} styleName={subTab === PROFILETABS.EDUCATION ? 'tab activeTab': 'tab'}><Education /><span style= {{marginLeft: "14px"}}>Education</span></a></li>  
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.WORK)} onClick={e => clickTab(e, PROFILETABS.WORK)} styleName={subTab === PROFILETABS.WORK ? 'tab activeTab': 'tab'}><Work /><span style= {{marginLeft: "14px"}}>Work</span></a></li>
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.ORGANIZATION)} onClick={e => clickTab(e, PROFILETABS.ORGANIZATION)} styleName={subTab === PROFILETABS.ORGANIZATION ? 'tab activeTab': 'tab'}><Organization /><span style= {{marginLeft: "14px"}}>Organization</span></a></li>
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.SKILL)} onClick={e => clickTab(e, PROFILETABS.SKILL)} styleName={subTab === PROFILETABS.SKILL ? 'tab activeTab': 'tab'}><Skill /><span style= {{marginLeft: "14px"}}>Skill</span></a></li>
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.HOBBY)} onClick={e => clickTab(e, PROFILETABS.HOBBY)} styleName={subTab === PROFILETABS.HOBBY ? 'tab activeTab': 'tab'}><Hobby /><span style= {{marginLeft: "14px"}}>Hobby</span></a></li>  
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.COMMUNITY)} onClick={e => clickTab(e, PROFILETABS.COMMUNITY)} styleName={subTab === PROFILETABS.COMMUNITY ? 'tab activeTab': 'tab'}><Community /><span style= {{marginLeft: "14px"}}>Community</span></a></li>
      </ul>
    </nav>
  );
}

ProfileSubtabs.propTypes = {
  subTab: PT.string.isRequired,
  selectTab: PT.func.isRequired,
};

