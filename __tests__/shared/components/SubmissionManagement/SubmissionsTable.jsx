import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import SubmissionsTable from 'components/SubmissionManagement/SubmissionsTable';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render(<SubmissionsTable />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
