import React from 'react';
import R from 'react-test-renderer/shallow';
import SubMenu from 'components/TopcoderHeader/mobile/SubMenu';

const renderer = new R();

test('Matches snapshot', () => {
  renderer.render((
    <SubMenu
      subMenu={{
        title: 'Menu title',
        items: [{
          icon: <div />,
          link: '/LINK',
          title: 'Item title',
        }],
      }}
    />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
