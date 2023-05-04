/**
 * Generic Login Modal Dialog
 */
/* global window */

import PT from 'prop-types';
import React from 'react';
import { Modal, PrimaryButton } from 'topcoder-react-ui-kit';
import { config, Link } from 'topcoder-react-utils';
import tc from 'components/buttons/themed/tc.scss';
import modalStyle from './modal.scss';

/** Themes for buttons
 * those overwrite PrimaryButton style to match achieve various styles.
 * Should implement pattern of classes.
 */
const buttonThemes = {
  tc,
};

function LoginModal({
  onCancel,
  retUrl,
  utmSource,
  modalTitle,
  modalText,
  infoNode,
}) {
  return (
    <Modal
      onCancel={onCancel}
      theme={modalStyle}
    >
      <div className={modalStyle.loginRequired}>
        <h3 className={modalStyle.title}>{modalTitle}</h3>
        <p className={modalStyle.loginMsg}>{modalText}</p>
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
          <Link to={`${config.URL.AUTH}/?retUrl=${encodeURIComponent(retUrl)}&mode=signUp${utmSource ? `&utm_source=${utmSource}` : ''}`} className={buttonThemes.tc['primary-white-md']}>REGISTER</Link>
        </div>
        {infoNode}
      </div>
    </Modal>
  );
}

LoginModal.defaultProps = {
  utmSource: null,
  infoNode: null,
};

LoginModal.propTypes = {
  onCancel: PT.func.isRequired,
  retUrl: PT.string.isRequired,
  utmSource: PT.string,
  modalTitle: PT.string.isRequired,
  modalText: PT.string.isRequired,
  infoNode: PT.node,
};

export default LoginModal;
