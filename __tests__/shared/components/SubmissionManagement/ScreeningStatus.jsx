import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import ScreeningStatus from 'components/SubmissionManagement/ScreeningStatus';
import mockScreeningObject from './__mocks__/screening-object.json';

function setup() {
  const props = {
    onShowDetails: jest.fn(),
    screeningObject: { ...mockScreeningObject.passedWithoutWarning },
    submissionId: '12345',
  };

  const enzymeWrapper = shallow(<ScreeningStatus {...props} />);

  return {
    props,
    enzymeWrapper,
  };
}

test('renders correctly', () => {
  const html = renderer.create((
    <ScreeningStatus
      screeningObject={mockScreeningObject.dummy}
      submissionId="12345"
    />
  )).toJSON();
  expect(html).toMatchSnapshot();
});

test('renders pending', () => {
  const html = renderer.create((
    <ScreeningStatus
      screeningObject={mockScreeningObject.pending}
      submissionId="12345"
    />
  )).toJSON();
  expect(html).toMatchSnapshot();
});

test('renders passed without warning', () => {
  const html = renderer.create((
    <ScreeningStatus
      screeningObject={mockScreeningObject.passedWithoutWarning}
      submissionId="12345"
    />
  )).toJSON();
  expect(html).toMatchSnapshot();
});

test('renders failed without warning', () => {
  const html = renderer.create((
    <ScreeningStatus
      screeningObject={mockScreeningObject.failedWithoutWarning}
      submissionId="12345"
    />
  )).toJSON();
  expect(html).toMatchSnapshot();
});

test('renders passed with warning', () => {
  const html = renderer.create((
    <ScreeningStatus
      screeningObject={mockScreeningObject.passedWithWarning}
      submissionId="12345"
    />
  )).toJSON();
  expect(html).toMatchSnapshot();
});

test('renders failed with warning', () => {
  const html = renderer.create((
    <ScreeningStatus
      screeningObject={mockScreeningObject.failedWithWarning}
      submissionId="12345"
    />
  )).toJSON();
  expect(html).toMatchSnapshot();
});

test('onShowDetails handler is called', () => {
  const { enzymeWrapper, props } = setup();
  const button = enzymeWrapper;
  button.props().onClick();
  expect(props.onShowDetails.mock.calls.length).toBe(1);
});
