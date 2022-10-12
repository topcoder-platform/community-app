/* eslint-disable react/no-danger */
import React, { useState } from 'react';
import PT from 'prop-types';

import { Modal, Button } from 'topcoder-react-ui-kit';

import IconClose from 'assets/images/icon-close-green.svg';
import Checkbox from 'components/GUIKit/Checkbox';
import EmailDetails from '../EmailDetails';

import {
  PAYMENT_METHOD_MAP,
  PAYMENT_METHOD_DETAILS_MAP,
  PAYMENT_PROVIDER,
} from '../constants';

import styles from './styles.scss';

const PaymentMethod = ({
  paymentMethod,
  show,
  handleClose,
  handleConfirm,
  handle,
  setSelectedMode,
  setPaymentService,
}) => {
  const [emailedDetails, setEmailedDetails] = useState(false);


  const onChange = () => {
    setEmailedDetails(!emailedDetails);
  };

  const { important, conditions, url } = PAYMENT_METHOD_DETAILS_MAP[
    paymentMethod
  ];

  const onVisitPaymentProvider = () => {
    window.open(url, '_blank');
  };

  const onConfirm = () => {
    localStorage.setItem(
      `${handle}_${PAYMENT_PROVIDER}`,
      paymentMethod,
    );
    setPaymentService(paymentMethod);
    handleConfirm();
    handleClose();
    setSelectedMode(true);
  };

  return (
    <Modal
      show={show}
      theme={{
        container: styles['modal-container'],
        overlay: styles['modal-overlay'],
      }}
      handleClose={handleClose}
      onCancel={handleClose}
    >
      <div title="Payment Setup" styleName="page-wrapper">
        <div styleName="payment-method">
          <div styleName="page-content">
            <div styleName="page-header">
              <div styleName="left-pane">
                <div styleName="payment-service-title">
                  {`connect your ${PAYMENT_METHOD_MAP[paymentMethod]} account`}
                </div>
              </div>
              <div styleName="icon" role="presentation" onClick={handleClose}>
                <IconClose />
              </div>
            </div>
            <div styleName="page-divider" />

            <div styleName="container">
              <div styleName="left-pane">
                <EmailDetails paymentMethod={paymentMethod} />
                <div styleName="form-input-checkbox">
                  <Checkbox
                    checked={emailedDetails}
                    className="payment-service-rc-checkbox"
                    onChange={onChange}
                  />
                  <span styleName="label">
                    Yes, I have emailed my details to{' '}
                    <a
                      href="mailto:support@topcoder.com"
                      styleName="support-email"
                    >
                      support@topcoder.com
                    </a>
                  </span>
                </div>
              </div>
              <div styleName="right-pane">
                <div styleName="title">{`Create ${PAYMENT_METHOD_MAP[paymentMethod]} account`}</div>
                <p styleName="important-text">{important}</p>
                <div
                  styleName="condition-text"
                  dangerouslySetInnerHTML={{ __html: conditions }}
                />
                <div styleName="visit-button-wrapper">
                  <Button
                    theme={{ button: emailedDetails ? styles['visit-button-desktop-disabled'] : styles['visit-button-desktop'] }}
                    onClick={onVisitPaymentProvider}
                    disabled={emailedDetails}
                  >
                    {`Visit ${PAYMENT_METHOD_MAP[paymentMethod]} to create account`}
                  </Button>
                </div>
              </div>
            </div>
            <div styleName="page-divider" />

            <div styleName="footer">
              <div styleName="confirm-button-wrapper">
                <Button
                  onClick={onConfirm}
                  disabled={!emailedDetails}
                  theme={{ button: styles['footer-confirm-button'] }}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};


PaymentMethod.defaultProps = {
  paymentMethod: '',
  show: false,
  handle: '',
  handleClose: () => {},
  handleConfirm: () => {},
  setPaymentService: () => {},
  setSelectedMode: () => {},
};

PaymentMethod.propTypes = {
  paymentMethod: PT.string,
  show: PT.bool,
  handle: PT.string,
  handleClose: PT.func,
  handleConfirm: PT.func,
  setSelectedMode: PT.func,
  setPaymentService: PT.func,
};

export default PaymentMethod;
