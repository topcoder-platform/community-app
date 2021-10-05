/**
 * Render Email verification success page
 */

import React from 'react';
import { isomorphy } from 'topcoder-react-utils';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import './styles.scss';

let assets;
if (isomorphy.isClientSide()) {
  assets = require.context('assets/images/account/email', false, /svg/)('./success.svg');
}

const Success = () => (
  <div styleName="outer-container">
    <div styleName="page">
      <div styleName="container">
        <img src={assets} alt="success-icon" />
        <h1>
          Email Verification Success
        </h1>
        <div styleName="text">
          Congratulations! Your email verification has been completed.
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

export default Success;
