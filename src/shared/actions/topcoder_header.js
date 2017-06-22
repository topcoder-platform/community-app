/**
 * Actions for the standard Topcoder header.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';

/**
 * Payload creator for OPEN_MENU action.
 * @param {Object} menu Menu to open.
 * @param {Object} triggerNode HTML node which has triggered the action.
 *  We gonna store to the state its on-screen layout position, so that
 *  when mouse cursor moves back and forth between that node and the
 *  opened menu, we can check it and keep the menu open.
 */
function openMenu(menu, triggerNode) {
  return ({
    menu,
    trigger: _.toPlainObject(triggerNode.getBoundingClientRect()),
  });
}

/**
 * Payload creator for OPEN_SEARCH action.
 * @param {Object} triggerNode HTML node which has triggered the action.
 *  This serves the same purpose as in openMenu() function.
 */
function openSearch(triggerNode) {
  return openMenu(undefined, triggerNode);
}

/**
 * The corresponding action sets current menu and submenu options to mark them
 * with special hightlighting in the header.
 * @param {String} menuTitle
 * @param {String} subMenuTitle
 */
function setCurrentNav(menuTitle, subMenuTitle) {
  return {
    menuTitle,
    subMenuTitle,
  };
}

export default createActions({
  TOPCODER_HEADER: {
    /* Closes the currently opened menu, if any. */
    CLOSE_MENU: _.noop,
    CLOSE_MOBILE_MENU: _.noop,

    /* Closes the search panel. */
    CLOSE_SEARCH: _.noop,

    OPEN_MENU: openMenu,
    OPEN_MOBILE_MENU: _.noop,
    OPEN_SEARCH: openSearch,

    SET_CURRENT_NAV: setCurrentNav,
  },
});
