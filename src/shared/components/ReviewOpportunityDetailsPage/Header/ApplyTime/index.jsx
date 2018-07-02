/**
 * Box which shows time left to apply, and renders an "Apply Now" button
 */
import moment from 'moment';
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import { time } from 'topcoder-react-lib';

import './styles.scss';

const { formatDuration } = time;

/**
 * ApplyTime Component
 */
const ApplyTime = ({
  hasApplied, onApply, openPositions, startDate,
}) => {
  const startMoment = moment(startDate);
  const timeLeft = startMoment.isAfter() ? formatDuration(startMoment - moment()) : 'None';

  return (
    <div styleName="container">
      {
        !hasApplied
        && (
        <div>
          <p>
TIME LEFT TO APPLY
          </p>
          <h2>
            {timeLeft}
          </h2>
        </div>
        )
      }
      <div styleName="button-wrapper">
        <PrimaryButton
          disabled={!timeLeft || !openPositions}
          onClick={() => onApply()}
        >
          {hasApplied ? 'Manage Applications' : 'Apply for review'}
        </PrimaryButton>
      </div>
    </div>
  );
};

/**
 * Prop Validation
 */
ApplyTime.propTypes = {
  hasApplied: PT.bool.isRequired,
  onApply: PT.func.isRequired,
  openPositions: PT.number.isRequired,
  startDate: PT.string.isRequired,
};

export default ApplyTime;
