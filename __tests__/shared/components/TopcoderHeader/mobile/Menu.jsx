import _ from 'lodash';
import React from 'react';
import R from 'react-test-renderer/shallow';
import Menu from 'components/TopcoderHeader/mobile/Menu';

const renderer = new R();

test('Matches snapshot', () => {
  renderer.render((
    <Menu
      close={_.noop}
      mainMenu={[{
        title: 'Menu title',
        items: [{
          icon: <div />,
          link: '/LINK',
          title: 'Item title',
        }],
      }]}
    />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
