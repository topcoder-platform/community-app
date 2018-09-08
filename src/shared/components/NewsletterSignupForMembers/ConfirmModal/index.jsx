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

import style from './style.scss';

export default function ConfirmModal({
  customTcAuthModalText,
  signup,
  resetSignupButton,
  skipConfirmSignup,
  token,
}) {
  let text;
  if (token) {
    text = (
      <p>
Do you want to subscribed to Newsletter
?
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

  const autoSignupUrl = window.location.href.match(/[^?]*/)[0];

  return (
    <Modal onCancel={resetSignupButton}>
      <div styleName="style.confirmMsg">
        {text}
      </div>
      { token ? (
        <div className={style.signupButtons}>
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
        <div className={style.loginButtons}>
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
  token: PT.string,
};
