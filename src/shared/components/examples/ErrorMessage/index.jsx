/**
 * ErrorMessage test
 */

import React from 'react';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import { fireErrorMessage } from 'utils/errors';

const ErrorMessageTest = () => (
  <div>
    <PrimaryButton
      onClick={() => {
        fireErrorMessage('Error Message #1', 'A sample error message');
        fireErrorMessage('Error Message #2', 'Another error message');
      }}
    >ErrorMessage Test</PrimaryButton>
  </div>
);

export default ErrorMessageTest;
