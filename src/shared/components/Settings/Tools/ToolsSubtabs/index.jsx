/**
 * Child component of Settings/TabBar renders bar for 4 tabs.
 */
import React from 'react';
import PT from 'prop-types';

import { TOOLSTABS } from 'actions/page/toolsSettings';
import './styles.scss';
export default function ToolsSubtabs(props) {
  const {
    subTab,
    selectTab,
  } = props;

  const clickTab = (e, tab) => {
      console.log("Tab in profile sub tabs", tab)
    e.preventDefault();
    setImmediate(() => {
      selectTab(tab);
    });
  };

  return (
    <nav>
      <ul>
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TOOLSTABS.DEVICES)} onClick={e => clickTab(e, TOOLSTABS.DEVICES)} styleName={subTab === TOOLSTABS.DEVICES ? 'tab activeTab': 'tab'} ><img src= 'https://d1aahxkjiobka8.cloudfront.net/static-assets/images/ee40363770ff83ee54b11af13ec17ded.png' />Devices</a></li>
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TOOLSTABS.SOFTWARE)} onClick={e => clickTab(e, TOOLSTABS.SOFTWARE)} styleName={subTab === TOOLSTABS.SOFTWARE ? 'tab activeTab': 'tab'}><img src= 'https://d1aahxkjiobka8.cloudfront.net/static-assets/images/ee40363770ff83ee54b11af13ec17ded.png' />Software</a></li>
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TOOLSTABS.SERVICEPROVIDERS)} onClick={e => clickTab(e, TOOLSTABS.SERVICEPROVIDERS)} styleName={subTab === TOOLSTABS.SERVICEPROVIDERS ? 'tab activeTab': 'tab'}><img src= 'https://d1aahxkjiobka8.cloudfront.net/static-assets/images/ee40363770ff83ee54b11af13ec17ded.png' />Service Providers</a></li>  
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TOOLSTABS.SUBSCRIPTIONS)} onClick={e => clickTab(e, TOOLSTABS.SUBSCRIPTIONS)} styleName={subTab === TOOLSTABS.SUBSCRIPTIONS ? 'tab activeTab': 'tab'}><img src= 'https://d1aahxkjiobka8.cloudfront.net/static-assets/images/ee40363770ff83ee54b11af13ec17ded.png' />Subscriptions</a></li>
      </ul>
    </nav>
  );
}

ToolsSubtabs.propTypes = {
  subTab: PT.string.isRequired,
  selectTab: PT.func.isRequired,
};

