import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import Submission from 'components/SubmissionManagement/Submission';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render(<Submission />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
