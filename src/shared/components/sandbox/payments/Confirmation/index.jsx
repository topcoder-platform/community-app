/**
 * Payment confirmation.
 */

import React from 'react';
import { Button, PrimaryButton } from 'components/buttons';

import Background from '../Background';

import './style.scss';

export default function Confirmation() {
  return (
    <Background>
      <div styleName="container">
        <h1 styleName="title">Payment Completed</h1>
        Your payment has been accepted and money will be shortly transfered from
        your account.
        <div>
          <p>$200 paid to Sky</p>
          <p>Develop a new project submit button logic for the main page.</p>
        </div>
        <Button
          to="/sandbox/payments/123"
        >Make another payment</Button>
        <PrimaryButton
          to="/sandbox/payments"
        >Ok, done for now</PrimaryButton>
      </div>
    </Background>
  );
}
