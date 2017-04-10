import React from 'react';
import renderer from 'react-test-renderer';

import SubmissionManagement from 'components/SubmissionManagement/SubmissionManagement';

import mockDesignSubmissionsObject from './__mocks__/design-submissions.json';
import mockDevSubmissionsObject from
'./__mocks__/dev-submissions.json';

test('matches snapshots for design submissions', () => {
  const html = renderer.create((
    <SubmissionManagement
      challenge={mockDesignSubmissionsObject.challenge}
      submissions={mockDesignSubmissionsObject.submissions}
    />
  )).toJSON();
  expect(html).toMatchSnapshot();
});

test('matches snapshots for development submissions', () => {
  const html = renderer.create((
    <SubmissionManagement
      challenge={mockDesignSubmissionsObject.challenge}
      submissions={mockDesignSubmissionsObject.submissions}
    />
  )).toJSON();
  expect(html).toMatchSnapshot();
});
