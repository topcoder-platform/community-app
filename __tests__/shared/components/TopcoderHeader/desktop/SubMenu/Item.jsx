import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import Item from 'components/SubMenu/Item';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <Item
      currentSubMenuTitle="title"
      icon={<div />}
      title="title"
      link="menu url"
    />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <Item
      currentSubMenuTitle="another title"
      icon={<div />}
      title="title"
      link="menu url"
    />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
