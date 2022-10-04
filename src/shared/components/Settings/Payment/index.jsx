/* eslint-disable prefer-destructuring */
import React from 'react';

import ErrorWrapper from '../ErrorWrapper';

import './styles.scss';

export default class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ErrorWrapper>
        <div styleName="payment-container">
          <div styleName="header">
            <h3>Payment Settings</h3>
          </div>
          <div styleName="platform-banner" />
        </div>
        <div styleName="footer" />
      </ErrorWrapper>
    );
  }
}

Payment.defaultProps = {
};

Payment.propTypes = {
};
