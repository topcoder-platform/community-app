/**
 * Reducer for state.topcoderHeader. This part of the state holds data
 * related to the standard Topcoder header.
 */

import actions from 'actions/topcoder_header';
import { handleActions } from 'redux-actions';

/**
 * Creates a new reducer with the specified initial state.
 * @param {Object} initialState Optional. Initial state.
 * @return Reducer.
 */
function create(initialState) {
  return handleActions({
    [actions.topcoderHeader.closeMenu](state) {
      return {
        ...state,
        openedMenu: null,
      };
    },
    [actions.topcoderHeader.closeMobileMenu](state) {
      return {
        ...state,
        mobileMenuOpened: false,
      };
    },
    [actions.topcoderHeader.closeSearch](state) {
      return {
        ...state,
        searchOpened: false,
      };
    },
    [actions.topcoderHeader.openMenu](state, action) {
      return {
        ...state,
        openedMenu: action.payload.menu,
        activeTrigger: action.payload.trigger,
      };
    },
    [actions.topcoderHeader.openMobileMenu]: state => ({
      ...state,
      mobileMenuOpened: true,
    }),
    [actions.topcoderHeader.openSearch]: (state, action) => ({
      ...state,
      searchOpened: true,
      activeTrigger: action.payload.trigger,
    }),
  }, initialState || {});
}

/* Default reducer with empty initial state. */
export default create();
