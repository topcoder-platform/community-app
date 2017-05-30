import React from 'react';
import renderer from 'react-test-renderer';

import SvgLoading from 'components/examples/SvgLoading';

test('matches snapshots', () => {
  const cmp = renderer.create(<SvgLoading />);
  expect(cmp.toJSON()).toMatchSnapshot();
});
