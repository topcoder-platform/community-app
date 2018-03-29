/**
 * Challenge status in payments listing.
 */

import PT from 'prop-types';
import React from 'react';
import DraftIcon from 'assets/images/sandbox/payments/status/draft.svg';
import ActiveIcon from 'assets/images/sandbox/payments/status/active.svg';
import CanceledIcon from 'assets/images/sandbox/payments/status/canceled.svg';
import CompletedIcon from 'assets/images/sandbox/payments/status/completed.svg';
import PausedIcon from 'assets/images/sandbox/payments/status/paused.svg';
import './style.scss';

const Icons = {
  DRAFT: DraftIcon,
  ACTIVE: ActiveIcon,
  COMPLETED: CompletedIcon,
  DELETED: CanceledIcon,
  PAUSED: PausedIcon,
};
export default function PaymentStatus({ status, text }) {
  const Icon = Icons[status] || CanceledIcon;
  return (
    <div styleName="paymentStatus">
      <Icon styleName="icon" />
      <span styleName="text">{text}</span>
    </div>
  );
}

PaymentStatus.propTypes = {
  status: PT.oneOf([
    'DRAFT',
    'ACTIVE',
    'COMPLETED',
    'DELETED',
    'PAUSED',
  ]).isRequired,
  text: PT.string.isRequired,
};
