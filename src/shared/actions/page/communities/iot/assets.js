/**
 * Actions powering the UI state of Iot community's assets page.
 */

import { createActions } from 'redux-actions';

/**
 * toggle grid display mode
 * */
function toggleGrid() {
  return 'grid';
}

/**
 * toggle list display mode
 * */
function toggleList() {
  return 'list';
}

export default createActions({
  PAGE: {
    COMMUNITIES: {
      IOT: {
        ASSETS: {
          TOGGLE_GRID: toggleGrid,
          TOGGLE_LIST: toggleList,
        },
      },
    },
  },
});
