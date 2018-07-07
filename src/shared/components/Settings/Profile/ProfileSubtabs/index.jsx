/**
 * Child component of Settings/TabBar renders bar for 4 tabs.
 */
import React from 'react';
import PT from 'prop-types';

import { PROFILETABS } from 'actions/page/profileSettings';
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
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.BASICINFO)} onClick={e => clickTab(e, PROFILETABS.BASICINFO)} styleName={subTab === PROFILETABS.BASICINFO ? 'tab activeTab': 'tab'}><img src= 'https://d1aahxkjiobka8.cloudfront.net/static-assets/images/ee40363770ff83ee54b11af13ec17ded.png' />Basic Info</a></li>
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.LANGUAGE)} onClick={e => clickTab(e, PROFILETABS.LANGUAGE)} styleName={subTab === PROFILETABS.LANGUAGE ? 'tab activeTab': 'tab'}><img src= "https://d1aahxkjiobka8.cloudfront.net/static-assets/images/8ef51c836d4a0d2ff82747505273adf7.png" />Language</a></li>
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.EDUCATION)} onClick={e => clickTab(e, PROFILETABS.EDUCATION)} styleName={subTab === PROFILETABS.EDUCATION ? 'tab activeTab': 'tab'}><img src= "https://d1aahxkjiobka8.cloudfront.net/static-assets/images/ee40363770ff83ee54b11af13ec17ded.png" />Education</a></li>  
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.WORK)} onClick={e => clickTab(e, PROFILETABS.WORK)} styleName={subTab === PROFILETABS.WORK ? 'tab activeTab': 'tab'}><img src= "https://d1aahxkjiobka8.cloudfront.net/static-assets/images/5a7afdff107cb2a2be288e5cbce8f54a.png" />Work</a></li>
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.ORGANIZATION)} onClick={e => clickTab(e, PROFILETABS.ORGANIZATION)} styleName={subTab === PROFILETABS.ORGANIZATION ? 'tab activeTab': 'tab'}><img src= "https://d1aahxkjiobka8.cloudfront.net/static-assets/images/9d6918a4f946abf91ff7c60f8cdcf8e4.png" />Organization</a></li>
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.SKILL)} onClick={e => clickTab(e, PROFILETABS.SKILL)} styleName={subTab === PROFILETABS.SKILL ? 'tab activeTab': 'tab'}><img src= "https://d1aahxkjiobka8.cloudfront.net/static-assets/images/cd19d871dc65f84246680c0b39ce0c7e.png" />Skill</a></li>
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.HOBBY)} onClick={e => clickTab(e, PROFILETABS.HOBBY)} styleName={subTab === PROFILETABS.HOBBY ? 'tab activeTab': 'tab'}><img src= "https://d1aahxkjiobka8.cloudfront.net/static-assets/images/d90a80aac1c4de4630b6ab0537d32e9b.png" />Hobby</a></li>  
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.COMMUNITY)} onClick={e => clickTab(e, PROFILETABS.COMMUNITY)} styleName={subTab === PROFILETABS.COMMUNITY ? 'tab activeTab': 'tab'}><img src= "https://d1aahxkjiobka8.cloudfront.net/static-assets/images/3a26ce9233d6b03e834585cee69d9537.png" />Community</a></li>
      </ul>
    </nav>
  );
}

ProfileSubtabs.propTypes = {
  subTab: PT.string.isRequired,
  selectTab: PT.func.isRequired,
};

