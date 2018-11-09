/**
 * Displays the payments by role, and number of total/open posititons
 */
import React from 'react';
import PT from 'prop-types';

import './styles.scss';

/**
 * PaymentInfo Component
 */
const PaymentInfo = ({ positions }) => (
  <div styleName="container">
    <div styleName="roles">
      {
        positions.map(position => (
          <div key={`${position.role} payment`} styleName="payment">
            <p>
              {position.role}
            </p>
            <h2>
$
              {position.payment}
            </h2>
          </div>
        ))
      }
      <div styleName="positions">
        <p styleName="accent">
OPEN POSITIONS:
        </p>
        <p>
          {
            positions.map((position, index) => (
              <span key={`${position.role} openings`}>
                {index !== 0 ? ' & ' : ''}
                <span styleName="accent">
                  {position.openPositions}
                </span>
                {' '}
                {position.role}
                {position.openPositions !== 1 ? 'S' : ''}
              </span>
            ))
          }
        </p>
      </div>
    </div>
  </div>
);

/**
 * Prop Validation
 */
PaymentInfo.propTypes = {
  positions: PT.arrayOf(PT.shape()).isRequired,
};

export default PaymentInfo;
