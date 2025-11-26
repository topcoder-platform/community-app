import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import SubmissionsTable from 'components/SubmissionManagement/SubmissionsTable';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <SubmissionsTable
      challenge={{ id: 'test-challenge' }}
      showDetails={{ 12345: true }}
      submissionObjects={[{
        id: '12345',
      }]}
      track="Design"
    />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <SubmissionsTable
      challenge={{ id: 'test-challenge' }}
      showDetails={{ 12345: true }}
      track="Design"
    />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
