import React from 'react';
import renderer from 'react-test-renderer';

import DataFetch from 'components/examples/DataFetch';

test('matches snapshots', () => {
  const cmp = renderer.create(<DataFetch />);
  expect(cmp.toJSON()).toMatchSnapshot();
});
