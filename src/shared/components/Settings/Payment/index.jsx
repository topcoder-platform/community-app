/* eslint-disable prefer-destructuring */
import React from 'react';
import PT from 'prop-types';

import ArrowRightIcon from 'assets/images/arrow-right-green.svg';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import { getPaymentPageUrl } from 'utils/url';

import ErrorWrapper from '../ErrorWrapper';
import TaxForm from './TaxForm';
import PaymentProvider from './PaymentProvider';


import styles from './styles.scss';

export default class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { handle } = this.props;

    return (
      <ErrorWrapper>
        <div styleName="payment-container">
          <div styleName="header">
            <h3>Payment Settings</h3>

            <a href={getPaymentPageUrl()} rel="noreferrer" target="_blank" styleName="header__link">
              <span>Manage Your Payments</span>
              <ArrowRightIcon />
            </a>
          </div>
          <TaxForm handle={handle} handleConfirm={() => {}} />
          <PaymentProvider handle={handle} handleConfirm={() => {}} />
          <a href={getPaymentPageUrl()} rel="noreferrer" target="_blank" styleName="header__link__mobile">
            <span>Manage Your Payments</span>
            <ArrowRightIcon />
          </a>
        </div>
        <div styleName="footer">
          <PrimaryButton
            onClick={this.save}
            theme={{
              button: `${styles['save-changes-btn']}`,
            }}
          >
            Save Changes
          </PrimaryButton>
        </div>
      </ErrorWrapper>
    );
  }
}

Payment.defaultProps = {
  handle: '',
};

Payment.propTypes = {
  handle: PT.string,
};
