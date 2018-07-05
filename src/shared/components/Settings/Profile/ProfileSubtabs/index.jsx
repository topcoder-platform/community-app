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

  return (
    <nav>
      <ul>
        <a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.BASICINFO)} onClick={e => clickTab(e, PROFILETABS.BASICINFO)} ><li styleName={subTab === PROFILETABS.BASICINFO ? 'activeTab' : 'inactiveTab'}>Basic Info</li></a>
        <li styleName={subTab === PROFILETABS.LANGUAGE ? 'activeTab' : 'inactiveTab'}><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.LANGUAGE)} onClick={e => clickTab(e, PROFILETABS.LANGUAGE)}>Language</a></li>
        <li styleName={subTab === PROFILETABS.EDUCATION ? 'activeTab' : 'inactiveTab'}><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.EDUCATION)} onClick={e => clickTab(e, PROFILETABS.EDUCATION)}>Education</a></li>  
        <li styleName={subTab === PROFILETABS.WORK ? 'activeTab' : 'inactiveTab'}><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.WORK)} onClick={e => clickTab(e, PROFILETABS.WORK)}>Work</a></li>
        <li styleName={subTab === PROFILETABS.ORGANIZATION ? 'activeTab' : 'inactiveTab'}><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.ORGANIZATION)} onClick={e => clickTab(e, PROFILETABS.ORGANIZATION)}>Organization</a></li>
        <li styleName={subTab === PROFILETABS.SKILL ? 'activeTab' : 'inactiveTab'}><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.SKILL)} onClick={e => clickTab(e, PROFILETABS.SKILL)}>Skill</a></li>
        <li styleName={subTab === PROFILETABS.HOBBY ? 'activeTab' : 'inactiveTab'}><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.HOBBY)} onClick={e => clickTab(e, PROFILETABS.HOBBY)}>Hobby</a></li>  
        <li styleName={subTab === PROFILETABS.COMMUNITY ? 'activeTab' : 'inactiveTab'}><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PROFILETABS.COMMUNITY)} onClick={e => clickTab(e, PROFILETABS.COMMUNITY)}>Community</a></li>
      </ul>
    </nav>
  );
}

ProfileSubtabs.propTypes = {
  subTab: PT.string.isRequired,
  selectTab: PT.func.isRequired,
};

