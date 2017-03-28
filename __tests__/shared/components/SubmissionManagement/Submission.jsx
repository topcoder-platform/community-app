import React from 'react';
import renderer from 'react-test-renderer';

import Submission from 'components/SubmissionManagement/Submission';

test('matches snapshots', () => {
  const html = renderer.create((
    <Submission />
  )).toJSON();
  expect(html).toMatchSnapshot();
});
