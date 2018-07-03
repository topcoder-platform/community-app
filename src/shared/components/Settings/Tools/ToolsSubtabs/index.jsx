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
        <li styleName={subTab === TOOLSTABS.DEVICES ? 'activeTab' : 'inactiveTab'}><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TOOLSTABS.DEVICES)} onClick={e => clickTab(e, TOOLSTABS.DEVICES)} >Devices</a></li>
        <li styleName={subTab === TOOLSTABS.SOFTWARE ? 'activeTab' : 'inactiveTab'}><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TOOLSTABS.SOFTWARE)} onClick={e => clickTab(e, TOOLSTABS.SOFTWARE)}>Software</a></li>
        <li styleName={subTab === TOOLSTABS.SERVICEPROVIDERS ? 'activeTab' : 'inactiveTab'}><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TOOLSTABS.SERVICEPROVIDERS)} onClick={e => clickTab(e, TOOLSTABS.SERVICEPROVIDERS)}>Service Providers</a></li>  
        <li styleName={subTab === TOOLSTABS.SUBSCRIPTIONS ? 'activeTab' : 'inactiveTab'}><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, TOOLSTABS.SUBSCRIPTIONS)} onClick={e => clickTab(e, TOOLSTABS.SUBSCRIPTIONS)}>Subscriptions</a></li>
      </ul>
    </nav>
  );
}

ToolsSubtabs.propTypes = {
  subTab: PT.string.isRequired,
  selectTab: PT.func.isRequired,
};

