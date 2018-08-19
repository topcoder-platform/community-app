/* eslint-env browser */

import _ from 'lodash';
import React from 'react';
import TopcoderHeader from 'components/TopcoderHeader';
import TU from 'react-dom/test-utils';

import { JU } from 'topcoder-react-utils';

const mockCloseMenu = jest.fn();
const mockCloseSearch = jest.fn();
const mockOpenMenu = jest.fn();
const mockOpenSearch = jest.fn();

function styleNameMatch(item, styleName) {
  return item && item.className && item.className.match(styleName);
}

test('Default render', () => {
  JU.shallowSnapshot((
    <TopcoderHeader
      closeMenu={_.noop}
      closeMobileMenu={_.noop}
      closeSearch={_.noop}
      currentNav={{}}
      openMenu={_.noop}
      openMobileMenu={_.noop}
      openSearch={_.noop}
    />
  ));
});

test('Render with open menu', () => {
  JU.shallowSnapshot((
    <TopcoderHeader
      closeMenu={_.noop}
      closeMobileMenu={_.noop}
      closeSearch={_.noop}
      currentNav={{
        menuTitle: 'Compete',
        subMenuTitle: 'All Challenges',
      }}
      openMenu={_.noop}
      openedMenu={{
        title: 'Compete',
        items: [{
          icon: <div />,
          link: '/link',
          title: 'Title',
        }],
      }}
      openMobileMenu={_.noop}
      openSearch={_.noop}
    />
  ));
});

test('Render with specified profile', () => {
  JU.shallowSnapshot((
    <TopcoderHeader
      closeMenu={_.noop}
      closeMobileMenu={_.noop}
      closeSearch={_.noop}
      currentNav={{}}
      openMenu={_.noop}
      openMobileMenu={_.noop}
      openSearch={_.noop}
      profile={{}}
      searchOpened
    />
  ));
});

describe.skip('User input handling', () => {
  let dom;
  beforeAll(() => {
    dom = JU.renderDom((
      <TopcoderHeader
        activeTrigger={{
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
        }}
        closeMenu={mockCloseMenu}
        closeMobileMenu={_.noop}
        closeSearch={mockCloseSearch}
        currentNav={{}}
        openMenu={mockOpenMenu}
        openMobileMenu={_.noop}
        openSearch={mockOpenSearch}
        profile={{}}
      />
    ));
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.skip('main-menu-item opens sub-menu when hovered', () => {
    const items = TU.findAllInRenderedTree(dom, item => item && item.className && item.className.match(/main-menu-item/));
    expect(items.length).toBeGreaterThan(1);
    TU.Simulate.mouseEnter(items[0]);
    expect(mockOpenMenu).toHaveBeenCalled();
  });

  test.skip('main-menu-item closes sub-menu when mouse leaves downward', () => {
    const items = TU.findAllInRenderedTree(dom, item => item && item.className && item.className.match(/main-menu-item/));
    expect(items.length).toBeGreaterThan(1);
    TU.Simulate.mouseLeave(items[0], { pageY: -1 });
    expect(mockCloseMenu).not.toHaveBeenCalled();
  });

  test.skip('main-menu-item closes sub-menu when mouse leaves not downards', () => {
    const items = TU.findAllInRenderedTree(dom, item => item && item.className && item.className.match(/main-menu-item/));
    expect(items.length).toBeGreaterThan(1);
    TU.Simulate.mouseLeave(items[0], { pageY: -2 });
    expect(mockCloseMenu).toHaveBeenCalled();
  });

  test.skip('user-menu handle opens sub-menu when hovered', () => {
    const items = TU.findAllInRenderedTree(dom, item => item && item.className && item.className.match(/user-menu/));
    expect(items.length).toBeGreaterThan(1);
    TU.Simulate.mouseEnter(items[0]);
    expect(mockOpenMenu).toHaveBeenCalled();
  });

  test.skip('user-menu handle closes sub-menu when mouse leaves downwards', () => {
    const items = TU.findAllInRenderedTree(dom, item => item && item.className && item.className.match(/user-menu/));
    expect(items.length).toBeGreaterThan(1);
    TU.Simulate.mouseLeave(items[0], { pageY: -1 });
    expect(mockCloseMenu).not.toHaveBeenCalled();
  });

  test.skip('user-menu closes sub-menu when mouse leaves not downards', () => {
    const items = TU.findAllInRenderedTree(dom, item => item && item.className && item.className.match(/user-menu/));
    expect(items.length).toBeGreaterThan(1);
    TU.Simulate.mouseLeave(items[0], { pageY: -2 });
    expect(mockCloseMenu).toHaveBeenCalled();
  });

  test('search-icon opens search when hovered', () => {
    const items = TU.findAllInRenderedTree(dom, item => item && item.className && item.className.match(/search-icon/));
    expect(items.length).toBe(1);
    TU.Simulate.mouseEnter(items[0]);
    expect(mockOpenSearch).toHaveBeenCalled();
  });

  test('search-icon closes search when mouse leaves downwards', () => {
    const items = TU.findAllInRenderedTree(dom, item => item && item.className && item.className.match(/search-icon/));
    expect(items.length).toBe(1);
    TU.Simulate.mouseLeave(items[0], { pageY: -1 });
    expect(mockCloseSearch).not.toHaveBeenCalled();
  });

  test('search-icon closes search when mouse leaves not downards', () => {
    const items = TU.findAllInRenderedTree(dom, item => item && item.className && item.className.match(/search-icon/));
    expect(items.length).toBe(1);
    TU.Simulate.mouseLeave(items[0], { pageY: -2 });
    expect(mockCloseSearch).toHaveBeenCalled();
  });

  test('sub-menu closes when mouse leave downwards', () => {
    const items = TU.findAllInRenderedTree(dom, item => styleNameMatch(item, 'closed-menu'));
    expect(items.length).toBe(1);
    TU.Simulate.mouseLeave(items[0], { pageY: 1 });
    expect(mockCloseMenu).toHaveBeenCalled();
  });

  test('search-field closes when mouse leaves downwards', () => {
    const items = TU.findAllInRenderedTree(dom, item => styleNameMatch(item, 'search-field'));
    expect(items.length).toBe(1);
    TU.Simulate.mouseLeave(items[0], { pageY: 1 });
    expect(mockCloseSearch).toHaveBeenCalled();
  });

  test('search-field won\'t close', () => {
    const items = TU.findAllInRenderedTree(dom, item => styleNameMatch(item, 'search-field'));
    expect(items.length).toBe(1);
    TU.Simulate.mouseLeave(items[0], { pageY: -1 });
    expect(mockCloseSearch).not.toHaveBeenCalled();
  });

  test('Enter submits search field', () => {
    const items = TU.findAllInRenderedTree(dom, item => styleNameMatch(item, 'search-field'));
    expect(items.length).toBe(1);
    expect(items[0].children.length).toBe(1);
    const input = items[0].children[0];
    expect(input.tagName).toBe('INPUT');
    TU.Simulate.keyPress(input, {
      key: 'Enter',
      target: {
        value: 'SEARCH',
      },
    });
    /* TODO: The commented out string below does not work with jest:
     * window.location comes from jsdom and works differently from
     * browser's window.location. Should be investigated how to make
     * this check properly. */
    // expect(window.location).toHaveBeenCalledWith('/search/members?q=SEARCH');
  });

  test('Other key won\'t submit', () => {
    const items = TU.findAllInRenderedTree(dom, item => styleNameMatch(item, 'search-field'));
    expect(items.length).toBe(1);
    expect(items[0].children.length).toBe(1);
    const input = items[0].children[0];
    expect(input.tagName).toBe('INPUT');
    TU.Simulate.keyPress(input, {
      key: 'A',
      target: {
        value: 'SEARCH',
      },
    });
  });
});
