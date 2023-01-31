/* eslint-disable react/no-danger */
import React from 'react';
import PT from 'prop-types';

import { PAYMENT_METHOD_DETAILS_MAP, PAYMENT_METHOD_MAP } from '../constants';
import './styles.scss';

/**
 * This component shows the steps to be done to
 * subscribe to this payment method
 * @returns
 */
const EmailDetails = ({ paymentMethod }) => {
  const { instructions } = PAYMENT_METHOD_DETAILS_MAP[paymentMethod];

  return (
    <div styleName="email-details">
      <div styleName="title">
        Do you have your {PAYMENT_METHOD_MAP[paymentMethod]} account details?
        Great!
      </div>
      <ul styleName="instructions">
        {instructions.map(instruction => (
          <li>
            <span dangerouslySetInnerHTML={{ __html: instruction.label }} />
            <ul styleName="instructions">
              {instruction.children
                && instruction.children.map(child => (
                  <li dangerouslySetInnerHTML={{ __html: child }} />
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

EmailDetails.defaultProps = {
  paymentMethod: '',
};

EmailDetails.propTypes = {
  paymentMethod: PT.string,
};

export default EmailDetails;
