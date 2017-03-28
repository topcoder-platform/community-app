import React from 'react';
import renderer from 'react-test-renderer';

import Modal from 'components/Modal';

test('matches snapshots', () => {
  const cmp = renderer.create(<Modal />);
  expect(cmp.toJSON()).toMatchSnapshot();
});
