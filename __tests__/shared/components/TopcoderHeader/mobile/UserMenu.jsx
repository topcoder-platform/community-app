import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import UserMenu from 'components/TopcoderHeader/mobile/UserMenu';

const rnd = new Rnd();

test('Snapshot match', () => {
  rnd.render((
    <UserMenu
      menu={{
        title: 'Title',
        items: [{
          icon: <div />,
          link: '/link',
          title: 'Item title',
        }],
      }}
      profile={{
        handle: 'username',
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
