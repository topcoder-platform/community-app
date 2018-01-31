/**
 * Payment confirmation.
 */

import PT from 'prop-types';
import React from 'react';
import { Button, PrimaryButton } from 'topcoder-react-ui-kit';
import Background from '../Background';

import './style.scss';

export default function Confirmation({
  amount,
  assignee,
  resetPaymentData,
}) {
  return (
    <Background>
      <div styleName="container">
        <div styleName="card">
          <h1 styleName="title">Payment Completed</h1>
          <p styleName="description">
            Your payment has been accepted and money will be shortly transfered from
            your account.
          </p>
          <div styleName="paycheck">
            <div styleName="info">
              <p styleName="user"><strong>${amount}</strong> paid to <strong styleName="name">{assignee}</strong></p>
              <p styleName="task">Develop a new project submit button logic for the main page.</p>
            </div>
          </div>
          <div styleName="actions">
            <Button
              onClick={resetPaymentData}
            >Make another payment</Button>
            <PrimaryButton
              to="/sandbox/payments"
            >Ok, done for now</PrimaryButton>
          </div>
        </div>
      </div>
    </Background>
  );
}

Confirmation.propTypes = {
  amount: PT.number.isRequired,
  assignee: PT.string.isRequired,
  resetPaymentData: PT.func.isRequired,
};
