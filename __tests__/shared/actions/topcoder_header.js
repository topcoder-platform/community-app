import actions from 'actions/topcoder_header';

const mockNode = {
  getBoundingClientRect: () => {},
};

test('openMenu', () => {
  const a = actions.topcoderHeader.openMenu('Menu', mockNode);
  expect(a.type).toBe('TOPCODER_HEADER/OPEN_MENU');
  expect(a.payload).toEqual({
    menu: 'Menu',
    trigger: {
    },
  });
});

test('openSearch', () => {
  const a = actions.topcoderHeader.openSearch(mockNode);
  expect(a.type).toBe('TOPCODER_HEADER/OPEN_SEARCH');
  expect(a.payload).toEqual({
    trigger: {
    },
  });
});

test('setCurrentNav', () => {
  const a = actions.topcoderHeader.setCurrentNav('title', 'subtitle');
  expect(a.type).toBe('TOPCODER_HEADER/SET_CURRENT_NAV');
  expect(a.payload).toEqual({
    menuTitle: 'title',
    subMenuTitle: 'subtitle',
  });
});
