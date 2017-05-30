import React from 'react';
import renderer from 'react-test-renderer';

import CssModules from 'components/examples/CssModules';

test('matches snapshots', () => {
  const cmp = renderer.create(<CssModules />);
  expect(cmp.toJSON()).toMatchSnapshot();
});
