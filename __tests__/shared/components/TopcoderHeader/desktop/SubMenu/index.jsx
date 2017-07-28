import React from 'react';
import _ from 'lodash';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import SubMenu from 'components/TopcoderHeader/desktop/SubMenu';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <SubMenu
      closeMenu={_.noop}
      menu={{ items: [{ title: 'title', icon: 'icon url', link: 'menu url' }] }}
    />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return <SubMenu {...this.props} />;
  }
}

const closeMenu = jest.fn();
const instance = TU.renderIntoDocument((<Wrapper
  trigger={{
    bottom: 10,
    left: 0,
    right: 10,
    top: 0,
  }}
  closeMenu={closeMenu}
/>));

test('closeMenu cancelled', () => {
  const menus = TU.scryRenderedDOMComponentsWithTag(instance, 'ul');
  expect(menus).toHaveLength(1);
  TU.Simulate.mouseLeave(menus[0], { pageY: 1 });
  expect(closeMenu).not.toHaveBeenCalled();
});

test('closeMenu executed', () => {
  const menus = TU.scryRenderedDOMComponentsWithTag(instance, 'ul');
  expect(menus).toHaveLength(1);
  TU.Simulate.mouseLeave(menus[0], { pageY: -1 });
  expect(closeMenu).toHaveBeenCalled();
});
