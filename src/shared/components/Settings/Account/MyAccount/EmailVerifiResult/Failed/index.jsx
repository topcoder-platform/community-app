import React from 'react';
import { isomorphy } from 'topcoder-react-utils';
import { PrimaryButton } from 'topcoder-react-ui-kit';
/**
 * Render Email verification failed page
 */
import './styles.scss';

let failureAsset;
if (isomorphy.isClientSide()) {
  failureAsset = require.context('assets/images/account/email', false, /svg/)('./failed.svg');
}

const Failed = () => (
  <div styleName="outer-container">
    <div styleName="page">
      <div styleName="container">
        <img src={failureAsset} alt="failed-icon" />
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
        <div styleName="tip">
          Make sure you&#39;re logged in with the right account
          or try updating your email again
        </div>
        <div styleName="button-back">
          <PrimaryButton
            styleName="white"
            to="/home"
          >
            Back to My Dashboard
          </PrimaryButton>
        </div>
      </div>
    </div>
  </div>
);

export default Failed;
