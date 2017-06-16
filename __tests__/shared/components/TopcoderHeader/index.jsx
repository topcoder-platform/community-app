/* eslint-env browser */

import _ from 'lodash';
import React from 'react';
import R from 'react-test-renderer/shallow';
import TopcoderHeader from 'components/TopcoderHeader';
import TU from 'react-dom/test-utils';

/* It is not possible to use functional components as arguments of
 * TU.renderIntoDocument(..), hence this class-wrapper. */
class Wrapper extends React.Component {
  componentDidMount() {}
  render() {
    return <TopcoderHeader {...this.props} />;
  }
}

const mockCloseMenu = jest.fn();
const mockCloseSearch = jest.fn();
const mockOpenMenu = jest.fn();
const mockOpenSearch = jest.fn();

function styleNameMatch(item, styleName) {
  return item && item.className && item.className.match(styleName);
}

const r = new R();

test('Default render', () => {
  r.render((
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
  expect(r.getRenderOutput()).toMatchSnapshot();
});

test('Render with open menu', () => {
  r.render((
    <TopcoderHeader
      closeMenu={_.noop}
      closeMobileMenu={_.noop}
      closeSearch={_.noop}
      currentNav={{}}
      openMenu={_.noop}
      openedMenu={{
        title: 'Menu Title',
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
  expect(r.getRenderOutput()).toMatchSnapshot();
});

test('Render with specified profile', () => {
  r.render((
    <TopcoderHeader
      closeMenu={_.noop}
      closeMobileMenu={_.noop}
      closeSearch={_.noop}
      currentNav={{}}
      openMenu={_.noop}
      openMobileMenu={_.noop}
      openSearch={_.noop}
      profile={{}}
    />
  ));
  expect(r.getRenderOutput()).toMatchSnapshot();
});

describe('User input handling', () => {
  let page;
  beforeAll(() => {
    page = TU.renderIntoDocument((
      <Wrapper
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

  test('main-menu-item opens sub-menu when hovered', () => {
    const items = TU.findAllInRenderedTree(page, item =>
      item && item.className && item.className.match(/main-menu-item/));
    expect(items.length).toBeGreaterThan(1);
    TU.Simulate.mouseEnter(items[0]);
    expect(mockOpenMenu).toHaveBeenCalled();
  });

  test('main-menu-item closes sub-menu when mouse leaves downward', () => {
    const items = TU.findAllInRenderedTree(page, item =>
      item && item.className && item.className.match(/main-menu-item/));
    expect(items.length).toBeGreaterThan(1);
    TU.Simulate.mouseLeave(items[0], { pageY: -1 });
    expect(mockCloseMenu).not.toHaveBeenCalled();
  });

  test('main-menu-item closes sub-menu when mouse leaves not downards', () => {
    const items = TU.findAllInRenderedTree(page, item =>
      item && item.className && item.className.match(/main-menu-item/));
    expect(items.length).toBeGreaterThan(1);
    TU.Simulate.mouseLeave(items[0], { pageY: -2 });
    expect(mockCloseMenu).toHaveBeenCalled();
  });

  test('user-menu handle opens sub-menu when hovered', () => {
    const items = TU.findAllInRenderedTree(page, item =>
      item && item.className && item.className.match(/user-menu/));
    expect(items.length).toBeGreaterThan(1);
    TU.Simulate.mouseEnter(items[0]);
    expect(mockOpenMenu).toHaveBeenCalled();
  });

  test('user-menu handle closes sub-menu when mouse leaves downwards', () => {
    const items = TU.findAllInRenderedTree(page, item =>
      item && item.className && item.className.match(/user-menu/));
    expect(items.length).toBeGreaterThan(1);
    TU.Simulate.mouseLeave(items[0], { pageY: -1 });
    expect(mockCloseMenu).not.toHaveBeenCalled();
  });

  test('user-menu closes sub-menu when mouse leaves not downards', () => {
    const items = TU.findAllInRenderedTree(page, item =>
      item && item.className && item.className.match(/user-menu/));
    expect(items.length).toBeGreaterThan(1);
    TU.Simulate.mouseLeave(items[0], { pageY: -2 });
    expect(mockCloseMenu).toHaveBeenCalled();
  });

  test('search-icon opens search when hovered', () => {
    const items = TU.findAllInRenderedTree(page, item =>
      item && item.className && item.className.match(/search-icon/));
    expect(items.length).toBe(1);
    TU.Simulate.mouseEnter(items[0]);
    expect(mockOpenSearch).toHaveBeenCalled();
  });

  test('search-icon closes search when mouse leaves downwards', () => {
    const items = TU.findAllInRenderedTree(page, item =>
      item && item.className && item.className.match(/search-icon/));
    expect(items.length).toBe(1);
    TU.Simulate.mouseLeave(items[0], { pageY: -1 });
    expect(mockCloseSearch).not.toHaveBeenCalled();
  });

  test('search-icon closes search when mouse leaves not downards', () => {
    const items = TU.findAllInRenderedTree(page, item =>
      item && item.className && item.className.match(/search-icon/));
    expect(items.length).toBe(1);
    TU.Simulate.mouseLeave(items[0], { pageY: -2 });
    expect(mockCloseSearch).toHaveBeenCalled();
  });

  test('sub-menu closes when mouse leave downwards', () => {
    const items = TU.findAllInRenderedTree(page, item =>
      styleNameMatch(item, 'closed-menu'));
    expect(items.length).toBe(1);
    TU.Simulate.mouseLeave(items[0], { pageY: 1 });
    expect(mockCloseMenu).toHaveBeenCalled();
  });

  test('search-field closes when mouse leaves downwards', () => {
    const items = TU.findAllInRenderedTree(page, item =>
      styleNameMatch(item, 'search-field'));
    expect(items.length).toBe(1);
    TU.Simulate.mouseLeave(items[0], { pageY: 1 });
    expect(mockCloseSearch).toHaveBeenCalled();
  });

  test('Enter submits search field', () => {
    const items = TU.findAllInRenderedTree(page, item =>
      styleNameMatch(item, 'search-field'));
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
});
