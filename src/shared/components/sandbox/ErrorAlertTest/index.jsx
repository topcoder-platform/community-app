/**
 * errorAlert test
 */

import React from 'react';
import { PrimaryButton } from 'components/buttons';
import errorAlert from 'utils/errorAlert';

const ErrorAlertTest = () => (
  <div>
    <PrimaryButton
      onClick={() => {
        errorAlert('Error Alert Test', 'This is a test of the errorAlert function imported from utils/errorAlert');
        errorAlert('Error Alert Test 2', 'And this is a test of the error reporting queue');
      }}
    >errorAlert Test</PrimaryButton>
  </div>
);

export default ErrorAlertTest;
