import Button from 'components/Button';
import React from 'react';
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const button = renderer.create((
    <Button className="testClassName">Test Button</Button>
  )).toJSON();
  expect(button).toMatchSnapshot();
});
