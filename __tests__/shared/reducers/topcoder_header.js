import { mockAction } from 'utils/mock';

const FIELD = 'FIELD';

const mockActions = {
  topcoderHeader: {
    closeMenu: mockAction('TOPCODER_HEADER/CLOSE_MENU'),
    closeMobileMenu: mockAction('TOPCODER_HEADER/CLOSE_MOBILE_MENU'),
    closeSearch: mockAction('TOPCODER_HEADER/CLOSE_SEARCH'),
    openMenu: mockAction('TOPCODER_HEADER/OPEN_MENU', {
      menu: 'MENU',
      trigger: 'TRIGGER',
    }),
    openMobileMenu: mockAction('TOPCODER_HEADER/OPEN_MOBILE_MENU'),
    openSearch: mockAction('TOPCODER_HEADER/OPEN_SEARCH', {
      trigger: 'TRIGGER',
    }),
  },
};

const reducers = require('reducers/topcoder_header');

function testReducer(reducer, istate) {
  test('Correct initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(istate);
  });

  test('TOPCODER_HEADER/CLOSE_MENU', () => {
    const state = reducer({ FIELD }, mockActions.topcoderHeader.closeMenu());
    expect(state).toEqual({
      FIELD,
      openedMenu: null,
    });
  });

  test('TOPCODER_HEADER/CLOSE_MOBILE_MENU', () => {
    const state = reducer({
      FIELD,
    }, mockActions.topcoderHeader.closeMobileMenu());
    expect(state).toEqual({
      FIELD,
      mobileMenuOpened: false,
    });
  });

  test('TOPCODER_HEADER/CLOSE_SEARCH', () => {
    const state = reducer({ FIELD }, mockActions.topcoderHeader.closeSearch());
    expect(state).toEqual({ FIELD, searchOpened: false });
  });

  test('TOPCODER_HEADER/OPEN_MENU', () => {
    const state = reducer({ FIELD }, mockActions.topcoderHeader.openMenu());
    expect(state).toEqual({
      FIELD,
      activeTrigger: 'TRIGGER',
      openedMenu: 'MENU',
    });
  });

  test('TOPCODER_HEADER/OPEN_MOBILE_MENU', () => {
    const state = reducer({
      FIELD,
    }, mockActions.topcoderHeader.openMobileMenu());
    expect(state).toEqual({
      FIELD,
      mobileMenuOpened: true,
    });
  });

  test('TOPCODER_HEADER/OPEN_SEARCH', () => {
    const state = reducer({ FIELD }, mockActions.topcoderHeader.openSearch());
    expect(state).toEqual({
      FIELD,
      activeTrigger: 'TRIGGER',
      searchOpened: true,
    });
  });
}

describe('Default reducer', () =>
  testReducer(reducers.default, {
    currentNav: {},
  }),
);

