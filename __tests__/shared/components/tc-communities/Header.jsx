import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import Header from 'components/tc-communities/Header';
import TU from 'react-dom/test-utils';

const mockOnMobileToggle = jest.fn();

const rnd = new Rnd();

test('Snapshot match', () => {
  rnd.render((
    <Header
      onMobileToggleClick={mockOnMobileToggle}
      communityId="someId"
      registerUrl="/some/register/url"
      loginUrl="/some/login/url"
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <Header
      onMobileToggleClick={mockOnMobileToggle}
      communityId="someId"
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

const page = TU.renderIntoDocument((
  <Wrapper
    onMobileToggleClick={mockOnMobileToggle}
    communityId="someId"
    registerUrl="/some/register/url"
    loginUrl="/some/login/url"
  />
));

describe('Toggle mobile menu', () => {
  beforeEach(() => jest.clearAllMocks());

  test('onMobileToggle', () => {
    const btn = TU.findAllInRenderedTree(page, item =>
      item && item.className && item.className.match(/mobile-toggle/));
    expect(btn.length).toBe(1);
    TU.Simulate.click(btn[0]);
    expect(mockOnMobileToggle).toHaveBeenCalled();
  });
});
