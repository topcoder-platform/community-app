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
import { Modal, Button, PrimaryButton } from 'topcoder-react-ui-kit';
import { COMPOSE } from 'react-css-super-themr';
import style from './style.scss';

import ConfirmModal from './ConfirmModal';

export const STATE = {
  CONFIRM_SIGNUP: 'confirm-signup',
  DEFAULT: 'default',
  HIDDEN: 'hidden',
  SIGNEDUP: 'signedup',
  SIGNING: 'signing',
};

export default function NewsletterSignupForMembers({
  customSignupConfirmationText,
  customTcAuthModalText,
  hideSignupButton,
  signup,
  hiddenButtonText,
  label,
  resetSignupButton,
  skipConfirmSignup,
  showSignupConfirmModal,
  state,
  theme,
  token,
}) {
  if (state === STATE.HIDDEN) {
    return (
      <div styleName="style.placeholder">
        {hiddenButtonText}
      </div>
    );
  }
  return (
    <div
      className={theme.container}
    >
      <Button
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
      </Button>
      { state === STATE.SIGNEDUP ? (
        <Modal onCancel={hideSignupButton}>
          <h1 styleName="style.modalTitle">
Congratulations!
          </h1>
          <p styleName="style.modalMsg">
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
Return to the Newsletter
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
    </div>
  );
}

NewsletterSignupForMembers.defaultProps = {
  customSignupConfirmationText: '',
  customTcAuthModalText: '',
  hiddenButtonText: '',
  label: 'Subscribed for Newsletter',
  skipConfirmSignup: false,
  theme: {},
  token: null,
};

NewsletterSignupForMembers.propTypes = {
  customSignupConfirmationText: PT.string,
  customTcAuthModalText: PT.string,
  hiddenButtonText: PT.string,
  signup: PT.func.isRequired,
  label: PT.string,
  hideSignupButton: PT.func.isRequired,
  showSignupConfirmModal: PT.func.isRequired,
  resetSignupButton: PT.func.isRequired,
  skipConfirmSignup: PT.bool,
  state: PT.oneOf(_.values(STATE)).isRequired,
  theme: PT.shape(),
  token: PT.string,
};
