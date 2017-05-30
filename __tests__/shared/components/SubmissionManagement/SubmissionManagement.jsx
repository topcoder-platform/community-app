import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import SubmissionManagement from 'components/SubmissionManagement/SubmissionManagement';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <SubmissionManagement
      challenge={{
        track: 'Challenge Track',
      }}
      submissions={[

      ]}
    />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
