import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const button = renderer.create((
    <LoadingIndicator />
  )).toJSON();
  expect(button).toMatchSnapshot();
});
