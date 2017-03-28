import React from 'react';
import renderer from 'react-test-renderer';

import ScreeningStatus from 'components/SubmissionManagement/ScreeningStatus';
import mockScreeningObject from './__mocks__/screening-object.json';

test('renders correctly', () => {
  const html = renderer.create((
    <ScreeningStatus
      screeningObject={mockScreeningObject}
      submissionId="12345"
    />
  )).toJSON();
  expect(html).toMatchSnapshot();
});
