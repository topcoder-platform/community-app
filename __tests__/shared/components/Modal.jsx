import Modal from 'components/Modal';
import React from 'react';
import Shallow from 'react-test-renderer/shallow';

test('Matches shallow shapshot', () => {
  const renderer = new Shallow();
  renderer.render(<Modal />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
