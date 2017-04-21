import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import ScreeningDetails from 'components/SubmissionManagement/ScreeningDetails';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render(<ScreeningDetails />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
