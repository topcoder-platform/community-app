/**
 * The modal used for login enforcing
 */

/* global window */

import PT from 'prop-types';
import React from 'react';
import { Modal, PrimaryButton } from 'topcoder-react-ui-kit';
import { config } from 'topcoder-react-utils';
import tc from 'components/buttons/themed/tc.scss';
import modalStyle from './modal.scss';

/** Themes for buttons
 * those overwrite PrimaryButton style to match achieve various styles.
 * Should implement pattern of classes.
 */
const buttonThemes = {
  tc,
};

function LoginModal({ retUrl }) {
  return (
    <Modal
      theme={modalStyle}
    >
      <div className={modalStyle.loginRequired}>
        <h3 className={modalStyle.title}>WARNING</h3>
        <p className={modalStyle.loginMsg}>You must be a Topcoder member to apply!</p>
        <div className={modalStyle.ctaButtons}>
          <PrimaryButton
            onClick={() => {
              window.location = `${config.URL.AUTH}/member?retUrl=${encodeURIComponent(retUrl)}`;
            }}
            theme={{
              button: buttonThemes.tc['primary-green-md'],
            }}
          >
            LOGIN
          </PrimaryButton>
        </div>
        <p className={modalStyle.regTxt}>Not a member? Register <a href={`${config.URL.AUTH}/member/registration?retUrl=${encodeURIComponent(retUrl)}`}>here</a>.</p>
      </div>
    </Modal>
  );
}

LoginModal.propTypes = {
  retUrl: PT.string.isRequired,
};

export default LoginModal;
