import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import Item from 'components/TopcoderHeader/desktop/SubMenu/Item';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <Item
      currentSubMenuTitle="title"
      icon="icon url"
      title="title"
      link="menu url"
    />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <Item
      currentSubMenuTitle="another title"
      icon="icon url"
      title="title"
      link="menu url"
    />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
