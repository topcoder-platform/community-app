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
import { COMPOSE } from 'react-css-super-themr';
import style from './style.scss';
import modalStyle from './modal.scss';

import ConfirmModal from './ConfirmModal';

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
}) {
  return (
    <div
      className={theme.container}
    >
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
        {...(theme.link ? { theme: theme.link, composeContextTheme: COMPOSE.SWAP } : {})}
      >
        { state === STATE.SIGNING ? (
          <div className={style.signingContainer}>
            <span>
              Signing...
            </span>
            <LoadingIndicator theme={{ container: style.loadingIndicator }} />
          </div>
        ) : label}
      </PrimaryButton>
      { state === STATE.SIGNEDUP ? (
        <Modal
          onCancel={hideSignupButton}
          theme={modalStyle}
        >
          <h1 className={modalStyle.modalTitle}>
            Congratulations!
          </h1>
          <p className={modalStyle.modalMsg}>
            {
              customSignupConfirmationText
              || 'You are subscribed to Newsletter'
            }
          </p>
          <PrimaryButton
            onClick={hideSignupButton}
            theme={{
              button: style.returnToCommunityButton,
            }}
          >
            Close
          </PrimaryButton>
        </Modal>
      ) : null}
      { state === STATE.CONFIRM_SIGNUP ? (
        <ConfirmModal
          customTcAuthModalText={customTcAuthModalText}
          signup={signup}
          resetSignupButton={resetSignupButton}
          skipConfirmSignup={skipConfirmSignup}
          token={token}
        />
      ) : null}
      { state === STATE.ERROR ? (
        <Modal
          onCancel={resetSignupButton}
          theme={modalStyle}
        >
          <h1 className={modalStyle.modalTitle}>
            Sorry
          </h1>
          <p className={modalStyle.modalMsg}>
            {
              customSignupErrorText
              || 'We are not able to subscribe you now. Please try later'
            }
          </p>
          <PrimaryButton
            onClick={resetSignupButton}
            theme={{
              button: style.returnToCommunityButton,
            }}
          >
            Close
          </PrimaryButton>
        </Modal>
      ) : null}
    </div>
  );
}

NewsletterSignupForMembers.defaultProps = {
  customSignupConfirmationText: '',
  customSignupErrorText: '',
  customTcAuthModalText: '',
  hiddenButtonText: '',
  skipConfirmSignup: false,
  theme: {},
  token: null,
};

NewsletterSignupForMembers.propTypes = {
  customSignupConfirmationText: PT.string,
  customSignupErrorText: PT.string,
  customTcAuthModalText: PT.string,
  hiddenButtonText: PT.string,
  signup: PT.func.isRequired,
  label: PT.string.isRequired,
  hideSignupButton: PT.func.isRequired,
  showSignupConfirmModal: PT.func.isRequired,
  resetSignupButton: PT.func.isRequired,
  skipConfirmSignup: PT.bool,
  state: PT.oneOf(_.values(STATE)).isRequired,
  theme: PT.shape(),
  token: PT.string,
};
