/**
 * Child component of Settings/TabBar renders bar for 4 tabs.
 */
import React from 'react';
import PT from 'prop-types';

import { ACCOUNTTABS } from 'actions/page/accountSettings';
import MyAccount from '../../../../../assets/images/accountNavbar/myaccount.svg';
import LinkedAccount from '../../../../../assets/images/accountNavbar/linked-account.svg';

import './styles.scss';
export default function AccountSubtabs(props) {
  const {
    subTab,
    selectTab,
  } = props;

  const clickTab = (e, tab) => {
      console.log("Tab in account sub tabs", tab)
    e.preventDefault();
    setImmediate(() => {
      selectTab(tab);
    });
  };

  return (
    <nav>
      <ul>
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, ACCOUNTTABS.MYACCOUNT)} onClick={e => clickTab(e, ACCOUNTTABS.MYACCOUNT)} styleName={subTab === ACCOUNTTABS.MYACCOUNT ? 'tab activeTab': 'tab'} ><MyAccount /><span style= {{marginLeft: "14px"}}>My Account</span></a></li>
        <li styleName= 'navlist'><a role="link" tabIndex={0} onKeyPress={e => clickTab(e, ACCOUNTTABS.LINKEDACCOUNT)} onClick={e => clickTab(e, ACCOUNTTABS.LINKEDACCOUNT)} styleName={subTab === ACCOUNTTABS.LINKEDACCOUNT ? 'tab activeTab': 'tab'}><LinkedAccount /><span style= {{marginLeft: "14px"}}>Linked Account</span></a></li>
      </ul>
    </nav>
  );
}

AccountSubtabs.propTypes = {
  subTab: PT.string.isRequired,
  selectTab: PT.func.isRequired,
};

