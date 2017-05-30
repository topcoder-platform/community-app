import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import Text from 'components/tc-communities/Text';

const rnd = new Rnd();

test('Snapshot match', () => {
  rnd.render((
    <Text>
      <div>content</div>
    </Text>
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <Text
      theme={{
        container: 'container',
      }}
    >
      <div>content</div>
    </Text>
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
