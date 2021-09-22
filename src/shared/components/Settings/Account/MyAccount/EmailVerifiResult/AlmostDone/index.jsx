/**
 * Render Email verification almost done page
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { Redirect } from 'react-router';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import { isomorphy } from 'topcoder-react-utils';
import './styles.scss';

let asset;
if (isomorphy.isClientSide()) {
  asset = require.context('assets/images/account/email', false, /svg/)('./email-confirmation-icon.svg');
}

const VERIFIED_EMAIL_OPTIONS = ['old', 'new'];
const AlmostDone = ({ location }) => {
  const verifiedEmail = _.get(location, 'state.verifiedEmail');
  if (!verifiedEmail || VERIFIED_EMAIL_OPTIONS.indexOf(verifiedEmail) < 0) {
    return <Redirect to="/settings/account" />;
  }
  const [firstEmail, secondEmail] = verifiedEmail === VERIFIED_EMAIL_OPTIONS[0]
    ? VERIFIED_EMAIL_OPTIONS
    : VERIFIED_EMAIL_OPTIONS.reverse();
  return (
    <div styleName="outer-container">
      <div styleName="page">
        <div styleName="container">
          <img src={asset} alt="almost-done-icon" />
          <h1>
            Almost done! One more step!
          </h1>
          <div styleName="text">
            The action was verified from your <strong>{firstEmail}</strong> email account.&nbsp;
            Please<br />
            click the link from your <strong>{secondEmail}</strong> account to complete the change.
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
};

AlmostDone.defaultProps = {
  location: {},
};

AlmostDone.propTypes = {
  location: PT.shape(),
};

export default AlmostDone;
