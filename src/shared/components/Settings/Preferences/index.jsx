/**
 * Child component of Settings/Email renders setting page for misc preferences.
 */
import React from 'react';

import { config } from 'topcoder-react-utils';

import './styles.scss';

export default function Preferences() {
  return (
    <div styleName="preferences-container">
      <ul>
        <li>
          <a href={`${config.URL.FORUMS}/?module=Settings`} target="_blank" rel="noopener noreferrer">
            <div styleName="icon"><i className="fa fa-comment" /></div>
            <span>Forum Preferences</span>
            <div styleName="description">Change how forums are displayed and when you&quot;re notified regarding activity</div>
          </a>
        </li>
        <li>
          <a href={`${config.URL.COMMUNITY}/tc?module=EditPaymentPreferences`} target="_blank" rel="noopener noreferrer">
            <div styleName="icon"><i className="fa fa-credit-card" /></div>
            <span>Payment Preferences</span>
            <div styleName="description">Select your preferred payment method and set accrual limits</div>
          </a>
        </li>
        <li>
          <a href={`${config.URL.COMMUNITY}/tc?module=VisaSelection`} target="_blank" rel="noopener noreferrer">
            <div styleName="icon"><i className="fa fa-user" /></div>
            <span>Invitation Letter</span>
            <div styleName="description">Need a visa letter for a Topcoder event? Get one here.</div>
          </a>
        </li>
        <li>
          <a href={`${config.URL.COMMUNITY}/tc?module=ViewReferrals`} target="_blank" rel="noopener noreferrer">
            <div styleName="icon"><i className="fa fa-users" /></div>
            <span>Referrals</span>
            <div styleName="description">If you participated in our past referral program, see who registered using your invitation link</div>
          </a>
        </li>
      </ul>
    </div>
  );
}
