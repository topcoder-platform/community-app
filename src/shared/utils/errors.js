/* eslint-env browser */

import actions from 'actions/errors';
import { utils } from 'topcoder-react-utils';

export const ERROR_ICON_TYPES = {
  NETWORK: 'network',
  API: 'api',
};

let store; // Will be set only when rendering client-side

export function setErrorsStore(s) {
  store = s;
}

/**
 * The function behaves similarly to javascript alert()
 * it will show a modal error diaglog with styling until the user clicks OK.
 */
export function fireErrorMessage(title, details) {
  if (utils.isomorphy.isClientSide() && store) {
    setImmediate(() => {
      store.dispatch(actions.errors.newError(title, details));
    });
  }
}

/**
 * clear all error icons
 */
export function clearAllErrorIcons() {
  if (utils.isomorphy.isClientSide() && store) {
    setImmediate(() => {
      store.dispatch(actions.errors.clearAllErrorIcons());
    });
  }
}

/**
 * add error message to error icon in bottom left in the screen.
 * @param id  id of error icon type (ERROR_ICON_TYPES.NETWORK or ERROR_ICON_TYPES.API)
 * @param title icon hover title
 * @param message icon hover message
 */
export function setErrorIcon(id, title, message) {
  if (utils.isomorphy.isClientSide() && store) {
    setImmediate(() => {
      store.dispatch(actions.errors.setErrorIcon(id, title, message));
    });
  }
}

/**
 * clear all error message for an error icon.
 * @param id  id of error icon type to clear
 */
export function clearErrorIcon(id) {
  if (utils.isomorphy.isClientSide() && store) {
    setImmediate(() => {
      store.dispatch(actions.errors.clearErrorIcon(id));
    });
  }
}
