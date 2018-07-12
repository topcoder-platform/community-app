import React from 'react';
import { isomorphy } from 'topcoder-react-utils';
import { PrimaryButton } from 'topcoder-react-ui-kit';
/**
 * Render Email verification failed page
 */
import './styles.scss';

let assets;
if (isomorphy.isClientSide()) {
  assets = require.context('assets/images/account/email', false, /svg/);
}

const Failed = () => (
  <div styleName="outer-container">
    <div styleName="page">
      <div styleName="container">
        <img src={assets('./failed.svg')} alt="failed-icon" />
        <h1>
          Email Verification Failed
        </h1>
        <div styleName="text">
          We could not verify your email. If you have any issues with your Topcoder account,
          please contact&nbsp;
          <span>
             support@topcoder.com
          </span>
          .
        </div>
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

export default Failed;
