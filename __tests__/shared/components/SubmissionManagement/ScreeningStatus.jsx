import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import ScreeningStatus from 'components/SubmissionManagement/ScreeningStatus';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <ScreeningStatus
      screeningObject={{
        status: 'Screening Status',
        warnings: [],
      }}
      submissionId="12345"
    />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
