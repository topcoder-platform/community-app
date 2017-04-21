import Button from 'components/Button';
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';

test('renders correctly', () => {
  const renderer = new ReactShallowRenderer();
  renderer.render(<Button />);
  const button = renderer.getRenderOutput();
  expect(button).toMatchSnapshot();
});
