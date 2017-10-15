/**
 * Payment editor.
 */

import React from 'react';
import Select from 'components/Select';
import { PrimaryButton } from 'components/buttons';

import Background from '../Background';

import './style.scss';

export default function Editor() {
  return (
    <Background>
      <div styleName="container">
        <h1 styleName="title">New Member Payment</h1>
        Project
        <Select />
        Billing account
        <Select />
        Title
        <Select />
        Description
        <Select />
        Assign to
        <Select />
        Amount
        <Select />
        <PrimaryButton
          to="/sandbox/payments/123/done"
        >Pay now</PrimaryButton>
      </div>
    </Background>
  );
}
