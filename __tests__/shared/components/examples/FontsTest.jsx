import React from 'react';
import renderer from 'react-test-renderer';

import FontsTest from 'components/examples/FontsTest';

test('matches snapshots', () => {
  const cmp = renderer.create(<FontsTest />);
  expect(cmp.toJSON()).toMatchSnapshot();
});
