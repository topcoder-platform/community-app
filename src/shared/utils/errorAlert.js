/**
 * This function behaves similarly to javascript alert()
 * it will show a modal error diaglog with styling until the user clicks OK
 */

/* eslint-env browser */

import actions from 'actions/ErrorAlert';
import { isClientSide } from 'utils/isomorphy';

let store; // Will be set only when rendering client-side

export const setErrorAlertStore = (s) => {
  store = s;
};

const errorAlert = (title, details) => {
  if (isClientSide() && store) {
    // setImmediate doesn't appear to be supported by most browsers
    // this should be roughly equivalent
    window.setTimeout(() => {
      store.dispatch(actions.errorAlert.newError(title, details));
    }, 0);
  }
};

export default errorAlert;
