/**
 * Dedicated SideBar for the preference page.
 * It is different from the common Settings/SideBar as it uses
 * links to external pages.
 * */
import React from 'react';
import PT from 'prop-types';

import { config } from 'topcoder-react-utils';
import SideItem from 'components/Settings/SideBar/SideItem';

import Email from 'assets/images/preferences/email.svg';
import Forum from 'assets/images/preferences/forum.svg';
import Invletter from 'assets/images/preferences/invletter.svg';
import Payment from 'assets/images/preferences/payment.svg';
import Personalization from 'assets/images/preferences/personalization.svg';
import Referral from 'assets/images/preferences/referral.svg';

import PreferenceSideItem from './SideItem';

import './styles.scss';

const urls = {
  FORUM: `${config.URL.FORUMS}/?module=Settings`,
  PAYMENT: `${config.URL.COMMUNITY}/tc?module=EditPaymentPreferences`,
  LETTER: `${config.URL.COMMUNITY}/tc?module=VisaSelection`,
  REFERRALS: `${config.URL.COMMUNITY}/tc?module=ViewReferrals`,
};

const icons = {
  EMAIL: <Email />,
  FORUM: <Forum />,
  PAYMENT: <Payment />,
  LETTER: <Invletter />,
  REFERRALS: <Referral />,
  PERSONALIZATION: <Personalization />,
};

export default function SideBar(props) {
  const {
    tabs,
    currentTab,
    toggle,
  } = props;

  return (
    <nav styleName="side-tab">
      <ul>
        {
          Object.keys(tabs).map((key) => {
            if (key in urls) {
              return (
                <li key={tabs[key]}>
                  <PreferenceSideItem
                    name={tabs[key]}
                    icon={icons[key]}
                    url={urls[key]}
                  />
                </li>
              );
            }
            return (
              <li key={tabs[key]}>
                <SideItem
                  icon={icons[key]}
                  name={tabs[key]}
                  currentTab={currentTab}
                  toggle={toggle}
                />
              </li>
            );
          })
        }
      </ul>
    </nav>
  );
}

SideBar.propTypes = {
  tabs: PT.shape().isRequired,
  currentTab: PT.string.isRequired,
  toggle: PT.func.isRequired,
};
