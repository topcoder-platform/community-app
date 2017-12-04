/**
 * This function will show error status icons in bottom left in screen.
 */

/* eslint-env browser */

import _ from 'lodash';
import actions from 'actions/status';
import { isClientSide } from 'utils/isomorphy';

let store; // Will be set only when rendering client-side

export function setStatusStore(s) {
  store = s;
}

export function clearErrorsStatus() {
  if (isClientSide() && store) {
    setImmediate(() => {
      store.dispatch(actions.status.clearErrorsStatus());
    });
  }
}

export function setNetworkErrorsStatus(url, message) {
  if (isClientSide() && store) {
    setImmediate(() => {
      store.dispatch(actions.status.setNetworkErrorsStatus(url, message));
    });
  }
}

export function clearNetworkErrorsStatus() {
  if (isClientSide() && store) {
    setImmediate(() => {
      store.dispatch(actions.status.clearNetworkErrorsStatus());
    });
  }
}

export function setApiErrorsStatus(url, message) {
  if (isClientSide() && store) {
    setImmediate(() => {
      store.dispatch(actions.status.setApiErrorsStatus(url, message));
    });
  }
}

export function clearApiErrorsStatus(url) {
  if (isClientSide() && store) {
    setImmediate(() => {
      store.dispatch(actions.status.clearApiErrorsStatus(url));
    });
  }
}
