/**
 * Render Email verification expired page
 */
import React from 'react';
import { isomorphy } from 'topcoder-react-utils';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import './styles.scss';

let assets;
if (isomorphy.isClientSide()) {
  assets = require.context('assets/images/account/email', false, /svg/);
}

const Expired = () => (
  <div styleName="outer-container">
    <div styleName="page">
      <div styleName="container">
        <img src={assets('./failed.svg')} alt="success-icon" />
        <h1>
          Email Verification Failed
        </h1>
        <div styleName="text">
          Sorry, this verification link is no longer valid due to one of the following reasons:
        </div>
        <ul>
          <li>
            <span>
              It has already been verified.
            </span>
          </li>
          <li>
            <span>
              It has expired or has been cancelled, any pending email
              change that is cancelled is no longer subject to verification.
            </span>
          </li>
        </ul>
        <div styleName="button-back">
          <PrimaryButton
            styleName="white"
            to="/settings/account"
          >
            Back to My Account
          </PrimaryButton>
        </div>
      </div>
    </div>
  </div>
);

export default Expired;
