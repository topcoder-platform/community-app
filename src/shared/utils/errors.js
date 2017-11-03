/**
 * This function behaves similarly to javascript alert()
 * it will show a modal error diaglog with styling until the user clicks OK
 */

/* eslint-env browser */

import actions from 'actions/errors';
import { isClientSide } from 'utils/isomorphy';

let store; // Will be set only when rendering client-side

export function setErrorsStore(s) {
  store = s;
}

export function fireErrorMessage(title, details) {
  if (isClientSide() && store) {
    setImmediate(() => {
      store.dispatch(actions.errors.newError(title, details));
    });
  }
}
