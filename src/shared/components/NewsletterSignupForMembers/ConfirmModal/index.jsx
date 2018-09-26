/**
 * The modal asking visitor to confirm that he wants to signup for Newsletter where
 * NewsletterSignupForMembers component is rendered. If visitor is authenticated it shows
 * Signup / Cancel buttons that do what they are supposed to do; otherwise it
 * shows Register & Signup / Log In & Signup / Cancel buttons, first of which get
 * visitor to registration / login flows, with return url making the signup to
 * happen automatically.
 */

/* global window */

import PT from 'prop-types';
import React from 'react';
import { Modal, PrimaryButton, SecondaryButton } from 'topcoder-react-ui-kit';
import { config } from 'topcoder-react-utils';
import { themr } from 'react-css-super-themr';
import defaultStyle from './style.scss';

function ConfirmModal({
  customTcAuthModalText,
  signup,
  resetSignupButton,
  skipConfirmSignup,
  token,
  theme,
}) {
  let text;
  if (token) {
    text = (
      <p>
        Do you want to subscribe to this newsletter?
      </p>
    );
    if (skipConfirmSignup) {
      setImmediate(() => signup());
    }
  } else {
    text = customTcAuthModalText || (
      <div>
        <p>
          You must be a Topcoder member before you can signup for Newsletter.
        </p>
        <p>
          To signup, login if you are already a member. If not, register first.
        </p>
      </div>
    );
  }

  const autoSignupUrl = `${window.location.href.match(/[^?]*/)[0]}?subscribeme=true`;

  return (
    <Modal
      onCancel={resetSignupButton}
      theme={theme}
    >
      <div className={theme.confirmMsg}>
        {text}
      </div>
      { token ? (
        <div className={theme.signupButtons}>
          <PrimaryButton
            onClick={() => signup()}
          >
            Signup
          </PrimaryButton>
          <SecondaryButton
            onClick={resetSignupButton}
          >
            Cancel
          </SecondaryButton>
        </div>
      ) : (
        <div className={theme.loginButtons}>
          <PrimaryButton
            onClick={() => {
              const url = encodeURIComponent(autoSignupUrl);
              window.location = `${config.URL.AUTH}/member?retUrl=${url}`;
            }}
          >
            Login
          </PrimaryButton>
          <PrimaryButton
            onClick={() => {
              let url = encodeURIComponent(autoSignupUrl);
              url = encodeURIComponent(`${config.URL.AUTH}/member?retUrl=${url}`);
              url = encodeURIComponent(url);
              window.location = `${config.URL.AUTH}/member/registration?retUrl=${url}`;
            }}
          >
            Register
          </PrimaryButton>
          <SecondaryButton
            onClick={resetSignupButton}
          >
            Cancel
          </SecondaryButton>
        </div>
      )}
    </Modal>
  );
}

ConfirmModal.defaultProps = {
  token: null,
};

ConfirmModal.propTypes = {
  customTcAuthModalText: PT.node.isRequired,
  signup: PT.func.isRequired,
  resetSignupButton: PT.func.isRequired,
  skipConfirmSignup: PT.bool.isRequired,
  theme: PT.shape().isRequired,
  token: PT.string,
};

export default themr('NewsletterSignupForMembers-Modal', defaultStyle)(ConfirmModal);
