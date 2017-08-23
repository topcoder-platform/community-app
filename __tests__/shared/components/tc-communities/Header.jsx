import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import Header from 'components/tc-communities/Header';
import TU from 'react-dom/test-utils';

const mockOnMobileToggle = jest.fn();

const rnd = new Rnd();

const COMMUNITY_SELECTOR = [{
  label: 'Community Name',
  value: '1',
}];

const closeMenu = jest.fn();
const openMenu = jest.fn();

test('Snapshot match', () => {
  rnd.render((
    <Header
      onMobileToggleClick={mockOnMobileToggle}
      communityId="someId"
      communitySelector={COMMUNITY_SELECTOR}
      registerUrl="/some/register/url"
      loginUrl="/some/login/url"
      menuItems={[]}
      pageId="home"
      closeMenu={closeMenu}
      openMenu={openMenu}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <Header
      onMobileToggleClick={mockOnMobileToggle}
      communityId="someId"
      communitySelector={COMMUNITY_SELECTOR}
      registerUrl="/some/register/url"
      loginUrl="/some/login/url"
      logos={['some/logo/url']}
      menuItems={[
        { title: 'Menu Item 1', url: 'pageId1' },
        { title: 'Menu Item 2', url: 'pageId2' },
        { title: 'Menu Item 3', url: 'pageId3' },
      ]}
      cssUrl="some/css/url"
      isMobileOpen
      pageId="other"
      closeMenu={closeMenu}
      openMenu={openMenu}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

class Wrapper extends React.Component {
  componentDidMount() {}
  render() {
    return <div><Header {...this.props} /></div>;
  }
}

describe('Toggle mobile menu', () => {
  beforeEach(() => jest.clearAllMocks());

  const page = TU.renderIntoDocument((
    <Wrapper
      onMobileToggleClick={mockOnMobileToggle}
      communityId="someId"
      communitySelector={COMMUNITY_SELECTOR}
      registerUrl="/some/register/url"
      loginUrl="/some/login/url"
      pageId="other"
      closeMenu={closeMenu}
      openMenu={openMenu}
    />
  ));

  test.skip('onMobileToggle', () => {
    const btn = TU.findAllInRenderedTree(page, item =>
      item && item.className && item.className.match(/mobile-toggle/));
    expect(btn.length).toBe(1);
    TU.Simulate.click(btn[0]);
    expect(mockOnMobileToggle).toHaveBeenCalled();
  });

  test('click register', () => {
    const matches = TU.findAllInRenderedTree(page, item =>
      item && item.className && item.className.match('btnRegister'));
    expect(matches).toHaveLength(1);
    TU.Simulate.click(matches[0]);
  });

  test('click login', () => {
    const matches = TU.findAllInRenderedTree(page, item =>
      item && item.className && item.className.match('btnLogin'));
    expect(matches).toHaveLength(1);
    TU.Simulate.click(matches[0]);
  });
});

describe('mouse event', () => {
  const page = TU.renderIntoDocument((
    <Wrapper
      onMobileToggleClick={mockOnMobileToggle}
      communityId="someId"
      communitySelector={COMMUNITY_SELECTOR}
      registerUrl="/some/register/url"
      loginUrl="/some/login/url"
      profile={{}}
      pageId="other"
      closeMenu={closeMenu}
      openMenu={openMenu}
      activeTrigger={{ bottom: 10, left: 10 }}
    />
  ));

  test.skip('mouse event', () => {
    const matches = TU.findAllInRenderedTree(page, item =>
      item && item.className && item.className.match('user-menu'));
    expect(matches).toHaveLength(2);
    TU.Simulate.mouseEnter(matches[0]);
    expect(openMenu).toHaveBeenCalledTimes(1);
    TU.Simulate.mouseLeave(matches[0], { pageY: 0 });
    expect(closeMenu).toHaveBeenCalledTimes(1);
    TU.Simulate.mouseLeave(matches[0], { pageY: 10 });
    expect(closeMenu).toHaveBeenCalledTimes(1);
  });
});
