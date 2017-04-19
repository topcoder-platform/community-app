import Button from 'components/Button';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

function setup() {
  const props = {
    onClick: jest.fn(),
  };

  const enzymeWrapper = shallow(<Button {...props} />);

  return {
    props,
    enzymeWrapper,
  };
}

test('renders correctly', () => {
  const button = renderer.create((
    <Button className="testClassName">Test Button</Button>
  )).toJSON();
  expect(button).toMatchSnapshot();
});

test('onClick handler is called', () => {
  const { enzymeWrapper, props } = setup();

  const button = enzymeWrapper;
  button.props().onClick();
  expect(props.onClick.mock.calls.length).toBe(1);
});
