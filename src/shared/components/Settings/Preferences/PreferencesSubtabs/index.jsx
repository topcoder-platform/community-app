/**
 * Child component of Settings/TabBar renders bar for 4 tabs.
 */
import React from 'react';
import PT from 'prop-types';

import { PREFERENCESTABS } from 'actions/page/preferencesSettings';
import './styles.scss';

export default function PreferencesSubtabs(props) {
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
        <li styleName={subTab === PREFERENCESTABS.EMAIL ? 'activeTab' : 'inactiveTab'}><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PREFERENCESTABS.EMAIL)} onClick={e => clickTab(e, PREFERENCESTABS.EMAIL)} >E-mail</a></li>
        <li styleName={subTab === PREFERENCESTABS.FORUM ? 'activeTab' : 'inactiveTab'}><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PREFERENCESTABS.FORUM)} onClick={e => clickTab(e, PREFERENCESTABS.FORUM)}>Forum</a></li>
        <li styleName={subTab === PREFERENCESTABS.PAYMENT ? 'activeTab' : 'inactiveTab'}><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PREFERENCESTABS.PAYMENT)} onClick={e => clickTab(e, PREFERENCESTABS.PAYMENT)}>Payment</a></li>  
        <li styleName={subTab === PREFERENCESTABS.INVITATIONLETTER ? 'activeTab' : 'inactiveTab'}><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PREFERENCESTABS.INVITATIONLETTER)} onClick={e => clickTab(e, PREFERENCESTABS.INVITATIONLETTER)}>Invitation Letter</a></li>
        <li styleName={subTab === PREFERENCESTABS.REFERRALS ? 'activeTab' : 'inactiveTab'}><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PREFERENCESTABS.REFERRALS)} onClick={e => clickTab(e, PREFERENCESTABS.REFERRALS)}>Referrals</a></li>
        <li styleName={subTab === PREFERENCESTABS.PERSONALIZATION ? 'activeTab' : 'inactiveTab'}><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, PREFERENCESTABS.PERSONALIZATION)} onClick={e => clickTab(e, PREFERENCESTABS.PERSONALIZATION)}>Personalization</a></li>
      </ul>
    </nav>
  );
}

PreferencesSubtabs.propTypes = {
  subTab: PT.string.isRequired,
  selectTab: PT.func.isRequired,
};

