import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Modal from 'components/Modal';

function setup() {
  const props = {
    onCancel: jest.fn(),
  };

  const enzymeWrapper = shallow(<Modal {...props} />);

  return {
    props,
    enzymeWrapper,
  };
}

test('matches snapshots', () => {
  const cmp = renderer.create(<Modal />);
  expect(cmp.toJSON()).toMatchSnapshot();
});

test('onCancel handler is called', () => {
  const { enzymeWrapper, props } = setup();
  const cancelButton = enzymeWrapper.find('button');
  cancelButton.props().onClick();
  expect(props.onCancel.mock.calls.length).toBe(1);
});
