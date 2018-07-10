/**
 * Child component of Settings/TabBar renders bar for 4 tabs.
 */
import React from 'react';
import PT from 'prop-types';

import { TOOLSTABS } from 'actions/page/toolsSettings';
import Device from '../../../../../assets/images/toolsNavbar/device.svg';
import ServiceProvider from '../../../../../assets/images/toolsNavbar/service-provider.svg';
import Software from '../../../../../assets/images/toolsNavbar/software.svg';
import Subscription from '../../../../../assets/images/toolsNavbar/subscription.svg';

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
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TOOLSTABS.DEVICES)} onClick={e => clickTab(e, TOOLSTABS.DEVICES)} styleName={subTab === TOOLSTABS.DEVICES ? 'tab activeTab': 'tab'} ><Device /><span style= {{marginLeft: "14px"}}>Devices</span></a></li>
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TOOLSTABS.SOFTWARE)} onClick={e => clickTab(e, TOOLSTABS.SOFTWARE)} styleName={subTab === TOOLSTABS.SOFTWARE ? 'tab activeTab': 'tab'}><Software /><span style= {{marginLeft: "14px"}}>Software</span></a></li>
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TOOLSTABS.SERVICEPROVIDERS)} onClick={e => clickTab(e, TOOLSTABS.SERVICEPROVIDERS)} styleName={subTab === TOOLSTABS.SERVICEPROVIDERS ? 'tab activeTab': 'tab'}><ServiceProvider /><span style= {{marginLeft: "14px"}}>Service Providers</span></a></li>  
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TOOLSTABS.SUBSCRIPTIONS)} onClick={e => clickTab(e, TOOLSTABS.SUBSCRIPTIONS)} styleName={subTab === TOOLSTABS.SUBSCRIPTIONS ? 'tab activeTab': 'tab'}><Subscription /><span style= {{marginLeft: "14px"}}>Subscriptions</span></a></li>
      </ul>
    </nav>
  );
}

ToolsSubtabs.propTypes = {
  subTab: PT.string.isRequired,
  selectTab: PT.func.isRequired,
};

