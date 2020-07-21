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
import { Modal, PrimaryButton } from 'topcoder-react-ui-kit';
import { config } from 'topcoder-react-utils';
import { themr } from 'react-css-super-themr';
import tc from 'components/buttons/themed/tc.scss';
import defaultStyle from './style.scss';
import modalStyle from '../modal.scss';

/** Themes for buttons
 * those overwrite PrimaryButton style to match achieve various styles.
 * Should implement pattern of classes.
 */
const buttonThemes = {
  tc,
};


function ConfirmModal({
  customTcAuthModalText,
  signup,
  resetSignupButton,
  skipConfirmSignup,
  token,
  theme,
  title,
  desc,
}) {
  let text;
  if (token) {
    text = (
      <div className={modalStyle.modalMsg}>
        <h4>{title}</h4>
        <p style={{ fontSize: '24px' }}>{desc}</p>
      </div>
    );
    if (skipConfirmSignup) {
      setImmediate(() => signup());
    }
  } else {
    text = customTcAuthModalText || (
      <div className={modalStyle.modalMsg}>
        <h4>{title}</h4>
        <p>
          You must be a Topcoder member before you can signup for Newsletter.
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
            onClick={resetSignupButton}
            theme={{
              button: buttonThemes.tc['primary-white-md'],
            }}
          >
            CANCEL
          </PrimaryButton>
          <PrimaryButton
            onClick={() => signup()}
            theme={{
              button: buttonThemes.tc['primary-green-md'],
            }}
          >
            Ok
          </PrimaryButton>
        </div>
      ) : (
        <div className={theme.loginButtons}>
          <PrimaryButton
            onClick={() => {
              const url = encodeURIComponent(autoSignupUrl);
              window.location = `${config.URL.AUTH}/member?retUrl=${url}`;
            }}
            theme={{
              button: buttonThemes.tc['primary-white-md'],
            }}
          >
            LOGIN
          </PrimaryButton>
          <PrimaryButton
            onClick={() => {
              let url = encodeURIComponent(autoSignupUrl);
              url = encodeURIComponent(`${config.URL.AUTH}/member?retUrl=${url}`);
              url = encodeURIComponent(url);
              window.location = `${config.URL.AUTH}/member/registration?retUrl=${url}`;
            }}
            theme={{
              button: buttonThemes.tc['primary-green-md'],
            }}
          >
            REGISTER
          </PrimaryButton>
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
  title: PT.string.isRequired,
  desc: PT.string.isRequired,
};

export default themr('NewsletterSignupForMembers-Modal', defaultStyle)(ConfirmModal);
