import React from 'react';
import renderer from 'react-test-renderer';

import SubmissionManagement from 'containers/SubmissionManagement';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => [],
  }),
);

test('matches snapshots', () => {
  const cmp = renderer.create(<SubmissionManagement />);
  expect(cmp.toJSON()).toMatchSnapshot();
});
