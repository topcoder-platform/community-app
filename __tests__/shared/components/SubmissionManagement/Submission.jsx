import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Submission from 'components/SubmissionManagement/Submission';

import mockScreeningObject from './__mocks__/screening-object.json';

function setup() {
  const props = {
    onDownload: jest.fn(),
    onDelete: jest.fn(),
    onShowDetails: jest.fn(),
  };

  const enzymeWrapper = shallow(<Submission {...props} />);

  return {
    props,
    enzymeWrapper,
  };
}

test('matches snapshots', () => {
  const html = renderer.create((
    <Submission />
  )).toJSON();
  expect(html).toMatchSnapshot();
});

test('renders screening status', () => {
  const submissionObject = {
    screening: mockScreeningObject.passedWithoutWarning,
  };

  const html = renderer.create((
    <Submission
      submissionObject={{ submissionObject }}
      type={'design'}
    />
  )).toJSON();
  expect(html).toMatchSnapshot();
});

test('onDownload, onDelete, onShowDetails handlers are called', () => {
  const { enzymeWrapper, props } = setup();
  const buttons = enzymeWrapper.find('button');
  expect(buttons.length).toBe(3);
  buttons.forEach(button => button.props().onClick());
  expect(props.onDownload.mock.calls.length).toBe(1);
  expect(props.onDelete.mock.calls.length).toBe(1);
  expect(props.onShowDetails.mock.calls.length).toBe(1);
});
