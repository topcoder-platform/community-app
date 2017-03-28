import React from 'react';
import renderer from 'react-test-renderer';

import Content from 'components/examples/Content';

jest.mock('react-router-dom');

test('matches snapshots', () => {
  const cmp = renderer.create(<Content />);
  expect(cmp.toJSON()).toMatchSnapshot();
});
