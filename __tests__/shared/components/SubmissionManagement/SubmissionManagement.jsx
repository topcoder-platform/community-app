import React from 'react';
import renderer from 'react-test-renderer';
import moment from 'moment';

import SubmissionManagement from 'components/SubmissionManagement/SubmissionManagement';

import mockDesignSubmissionsObject from './__mocks__/design-submissions.json';

let originalDateNow;

const mockedDateNow =
  moment('2017-04-03T00:00:00.000Z')
    .subtract(18, 'days')
    .subtract(18, 'hours')
    .subtract(8, 'minutes')
    .valueOf();

beforeEach(() => {
  originalDateNow = Date.now;
  global.Date.now = () => mockedDateNow;
});

afterEach(() => {
  global.Date.now = originalDateNow;
});

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
