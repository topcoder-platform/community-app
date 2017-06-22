/**
 * Reducer for state.topcoderHeader. This part of the state holds data
 * related to the standard Topcoder header.
 */

import _ from 'lodash';
import actions from 'actions/topcoder_header';
import { handleActions } from 'redux-actions';

/**
 * Creates a new reducer with the specified initial state.
 * @param {Object} initialState Optional. Initial state.
 * @return Reducer.
 */
function create(initialState = {}) {
  const a = actions.topcoderHeader;
  return handleActions({
    [a.closeMenu](state) {
      return {
        ...state,
        openedMenu: null,
      };
    },
    [a.closeMobileMenu](state) {
      return {
        ...state,
        mobileMenuOpened: false,
      };
    },
    [a.closeSearch](state) {
      return {
        ...state,
        searchOpened: false,
      };
    },
    [a.openMenu](state, action) {
      return {
        ...state,
        openedMenu: action.payload.menu,
        activeTrigger: action.payload.trigger,
      };
    },
    [a.openMobileMenu]: state => ({
      ...state,
      mobileMenuOpened: true,
    }),
    [a.openSearch]: (state, action) => ({
      ...state,
      searchOpened: true,
      activeTrigger: action.payload.trigger,
    }),
    [a.setCurrentNav]: (state, { payload }) => ({
      ...state,
      currentNav: payload,
    }),
  }, _.defaults(_.clone(initialState), {
    currentNav: {},
  }));
}

/* Default reducer with empty initial state. */
export default create();
