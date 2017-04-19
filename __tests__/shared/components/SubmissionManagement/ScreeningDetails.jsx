import React from 'react';
import renderer from 'react-test-renderer';

import ScreeningDetails from 'components/SubmissionManagement/ScreeningDetails';
import mockScreeningObject from './__mocks__/screening-object.json';

test('renders correctly', () => {
  const html = renderer.create((
    <ScreeningDetails
      screeningObject={mockScreeningObject.dummy}
      submissionId="12345"
    />
  )).toJSON();
  expect(html).toMatchSnapshot();
});

test('renders pending', () => {
  const html = renderer.create((
    <ScreeningDetails
      screeningObject={mockScreeningObject.pending}
      submissionId="12345"
    />
  )).toJSON();
  expect(html).toMatchSnapshot();
});

test('renders passed without warning', () => {
  const html = renderer.create((
    <ScreeningDetails
      screeningObject={mockScreeningObject.passedWithoutWarning}
      submissionId="12345"
    />
  )).toJSON();
  expect(html).toMatchSnapshot();
});

test('renders failed without warning', () => {
  const html = renderer.create((
    <ScreeningDetails
      screeningObject={mockScreeningObject.failedWithoutWarning}
      submissionId="12345"
    />
  )).toJSON();
  expect(html).toMatchSnapshot();
});

test('renders passed with warning', () => {
  const html = renderer.create((
    <ScreeningDetails
      screeningObject={mockScreeningObject.passedWithWarning}
      submissionId="12345"
    />
  )).toJSON();
  expect(html).toMatchSnapshot();
});

test('renders failed with warning', () => {
  const html = renderer.create((
    <ScreeningDetails
      screeningObject={mockScreeningObject.failedWithWarning}
      submissionId="12345"
    />
  )).toJSON();
  expect(html).toMatchSnapshot();
});

test('renders empty screening object', () => {
  const html = renderer.create((
    <ScreeningDetails
      screeningObject={null}
      submissionId="12345"
    />
  )).toJSON();
  expect(html).toMatchSnapshot();
});
