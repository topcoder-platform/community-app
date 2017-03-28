import React from 'react';
import renderer from 'react-test-renderer';

import ScreeningDetails from 'components/SubmissionManagement/ScreeningDetails';
import mockScreeningObject from './__mocks__/screening-object.json';

test('renders correctly', () => {
  const html = renderer.create((
    <ScreeningDetails
      screeningObject={mockScreeningObject}
      submissionId="12345"
    />
  )).toJSON();
  expect(html).toMatchSnapshot();
});
