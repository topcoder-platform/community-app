/**
 * Actions for the sidebar.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import { services } from 'topcoder-react-lib';

const { getUserSettingsService } = services.userSetting;

/**
 * Changes name of the specified filter (but does not save it to the backend).
 * @param {String} index
 * @param {String} name
 */
function changeFilterName(index, name) {
  return { index, name };
}

/**
 * Deletes saved filter.
 * @param {String} id
 * @param {Object} tokenV2
 * @return {Promise}
 */
function deleteSavedFilter(id, tokenV2) {
  return getUserSettingsService(tokenV2)
    .deleteFilter(id).then(() => id);
}

/**
 * Handles drag move event.
 * @param {Object} dragEvent ReactJS onDrag event.
 * @param {Object} dragState
 *
 * NOTE: This code is just taken from the previous version of the code. It has]
 * some flaws, but it is not the main problem for now.
 *
 * NOTE: This implementation of dragging has a flaw: if you take an item and
 * drug it down, you'll see that it is correctly moved down the list, but its
 * highlighting (at least in Chrome) remains in the original position. Compare
 * to the situation, when you drag an item upward the list: the highlighting
 * moves properly with the item. This is related to the way ReactJS interacts
 * with DOM, and, most probably, it is just easier to adopt some 3-rd party
 * Drag-n-Drop library, then to find out a work-around.
 */
function dragSavedFilterMove(dragEvent, dragState) {
  /* For a reason not clear to me, shortly after starting to drag a filter,
   * and also when the user releases the mouse button, thus ending the drag,
   * this handler gets an event with 'screenY' position equal 0. This breaks
   * the dragging handling, which works just fine otherwise. Hence, this simple
   * fix of the issue, until the real problem is figured out.
   */
  if (!dragEvent.screenY) return dragState;

  /* Calculation of the target position of the dragged item inside the filters
    * array. */
  const shift = (dragEvent.screenY - dragState.y) / dragEvent.target.offsetHeight;
  const index = Math.round(dragState.startIndex + shift);
  if (index === dragState.index) return dragState;
  return { ...dragState, currentIndex: index };
}

/**
 * Initializes drag of a filter item.
 * @param {Number} index
 * @param {Object} dragEvent
 * @return {Object}
 */
function dragSavedFilterStart(index, dragEvent) {
  return {
    currentIndex: index,
    startIndex: index,
    y: dragEvent.screenY,
  };
}

function getSavedFilters(tokenV2) {
  return getUserSettingsService(tokenV2).getFilters();
}

/**
 * After changing filter name with changeFilterName(..) this action can be used
 * to reset filter name to the one last saved into API. No API call is made,
 * as the last saved name is kept inside the state.
 * @param {String} index
 */
function resetFilterName(index) {
  return index;
}

/**
 * Saves filter to the backend.
 * @param {String} name
 * @param {Object} filter Filter state.
 * @param {String} tokenV2
 * @return {Promise}
 */
function saveFilter(name, filter, tokenV2) {
  return getUserSettingsService(tokenV2)
    .saveFilter(name, filter);
}

/**
 * Updates all saved filters (basically to update their ordering in the
 * backend).
 * @param {Array} savedFilters
 * @param {String} tokenV2
 */
function updateAllSavedFilters(savedFilters, tokenV2) {
  const service = getUserSettingsService(tokenV2);
  savedFilters.forEach(filter => service.updateFilter(filter.id, filter.name, filter.filter));
}

/**
 * Saves updated fitler to the backend.
 * @param {Object} filter
 * @param {String} tokenV2
 * @return {Promise}
 */
function updateSavedFilter(filter, tokenV2) {
  return getUserSettingsService(tokenV2)
    .updateFilter(filter.id, filter.name, filter.filter);
}

export default createActions({
  CHALLENGE_LISTING_FRONTEND: {
    SIDEBAR: {
      CHANGE_FILTER_NAME: changeFilterName,

      DELETE_SAVED_FILTER: deleteSavedFilter,

      DRAG_SAVED_FILTER_MOVE: dragSavedFilterMove,
      DRAG_SAVED_FILTER_START: dragSavedFilterStart,

      GET_SAVED_FILTERS: getSavedFilters,

      RESET_FILTER_NAME: resetFilterName,

      SAVE_FILTER_DONE: saveFilter,

      SAVE_FILTER_INIT: _.noop,

      /* Pass in the bucket type. */
      SELECT_BUCKET: _.identity,

      /* Pass in the index of filter inside savedFilters array. */
      SELECT_SAVED_FILTER: _.identity,

      /* Pass in true/false to enable/disable. */
      SET_EDIT_SAVED_FILTERS_MODE: _.identity,

      UPDATE_ALL_SAVED_FILTERS: updateAllSavedFilters,
      UPDATE_SAVED_FILTER: updateSavedFilter,
    },
  },
});
