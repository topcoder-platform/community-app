/**
 * NewsletterSignupForMembers component. It includes 'Subscribed for Newletter' button, which is
 * automatically hidden, when a user have already subscribed for Newletter. Button
 * text changes to the loading symbol, when the signing is underway. And a
 * modal is shown on success.
 */

import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import { Modal, PrimaryButton } from 'topcoder-react-ui-kit';
import tc from 'components/buttons/themed/tc.scss';
import style from './style.scss';
import modalStyle from './modal.scss';

import ConfirmModal from './ConfirmModal';

/** Themes for buttons
 * those overwrite PrimaryButton style to match achieve various styles.
 * Should implement pattern of classes.
 */
const buttonThemes = {
  tc,
};

export const STATE = {
  CONFIRM_SIGNUP: 'confirm-signup',
  DEFAULT: 'default',
  HIDDEN: 'hidden',
  SIGNEDUP: 'signedup',
  SIGNING: 'signing',
  ERROR: 'error',
};

export default function NewsletterSignupForMembers({
  customSignupConfirmationText,
  customSignupErrorText,
  customTcAuthModalText,
  hideSignupButton,
  signup,
  label,
  resetSignupButton,
  skipConfirmSignup,
  showSignupConfirmModal,
  state,
  theme,
  token,
  buttonTheme,
  title,
  desc,
}) {
  return (
    <div
      className={theme.container}
    >
      {
        state !== STATE.HIDDEN ? (
          <PrimaryButton
            disabled={state === STATE.HIDDEN}
            onClick={() => {
              switch (state) {
                case STATE.SIGNEDUP:
                case STATE.SIGNING:
                  return;
                default:
              }
              showSignupConfirmModal();
            }}
            className={state === STATE.SIGNING ? style.signing : ''}
            theme={{
              button: buttonThemes.tc[buttonTheme],
              disabled: buttonThemes.tc.themedButtonDisabled,
            }}
          >
            {state === STATE.SIGNING ? (
              <div className={style.signingContainer}>
                <span>
                  Signing...
                </span>
                <LoadingIndicator theme={{ container: style.loadingIndicator }} />
              </div>
            ) : label}
          </PrimaryButton>
        ) : null
      }
      {state === STATE.SIGNEDUP ? (
        <Modal
          onCancel={hideSignupButton}
          theme={modalStyle}
        >
          <div className={modalStyle.modalMsg}>
            <h4>Congratulations!</h4>
            <p style={{ fontSize: '24px' }}>
              {
                customSignupConfirmationText
                || 'You are now subscribed.'
              }
            </p>
          </div>
          <div className={modalStyle.buttons}>
            <PrimaryButton
              onClick={hideSignupButton}
              theme={{
                button: buttonThemes.tc['primary-green-md'],
              }}
            >
              RETURN TO PAGE
            </PrimaryButton>
          </div>
        </Modal>
      ) : null}
      {state === STATE.CONFIRM_SIGNUP ? (
        <ConfirmModal
          customTcAuthModalText={customTcAuthModalText}
          signup={signup}
          resetSignupButton={resetSignupButton}
          skipConfirmSignup={skipConfirmSignup}
          token={token}
          title={title}
          desc={desc}
        />
      ) : null}
      {state === STATE.ERROR ? (
        <Modal
          onCancel={resetSignupButton}
          theme={modalStyle}
        >
          <div className={modalStyle.modalMsg}>
            <h4>Sorry</h4>
            <p>
              {
                customSignupErrorText
                || 'We are not able to subscribe you now. Please try later.'
              }
            </p>
          </div>
          <div className={modalStyle.buttons}>
            <PrimaryButton
              onClick={resetSignupButton}
              theme={{
                button: buttonThemes.tc['primary-green-md'],
              }}
            >
              Close
            </PrimaryButton>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

NewsletterSignupForMembers.defaultProps = {
  customSignupConfirmationText: '',
  customSignupErrorText: '',
  customTcAuthModalText: '',
  skipConfirmSignup: false,
  theme: {},
  token: null,
};

NewsletterSignupForMembers.propTypes = {
  customSignupConfirmationText: PT.string,
  customSignupErrorText: PT.string,
  customTcAuthModalText: PT.string,
  signup: PT.func.isRequired,
  label: PT.string.isRequired,
  hideSignupButton: PT.func.isRequired,
  showSignupConfirmModal: PT.func.isRequired,
  resetSignupButton: PT.func.isRequired,
  skipConfirmSignup: PT.bool,
  state: PT.oneOf(_.values(STATE)).isRequired,
  theme: PT.shape(),
  token: PT.string,
  buttonTheme: PT.string.isRequired,
  title: PT.string.isRequired,
  desc: PT.string.isRequired,
};
