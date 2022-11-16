import React from 'react';
import cn from 'classnames';
import PT from 'prop-types';

import './styles.scss';

const PaymentInfo = ({
  icon, label, value, isLastChild,
}) => (
  <div styleName={cn('payment-info', isLastChild && 'last-child')}>
    <div styleName="header">
      <div styleName="icon-wrapper">{icon}</div>
      <div styleName="label">{label}</div>
    </div>
    <div styleName="content">
      <div styleName="value">{value}</div>
    </div>
  </div>
);

PaymentInfo.defaultProps = {
  icon: null,
  label: '',
  value: '',
  isLastChild: false,
};

PaymentInfo.propTypes = {
  icon: PT.node,
  label: PT.string,
  value: PT.string,
  isLastChild: PT.bool,
};

export default PaymentInfo;
