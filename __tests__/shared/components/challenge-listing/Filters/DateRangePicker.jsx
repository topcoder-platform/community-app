import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import DateRangePicker from 'components/challenge-listing/Filters/DateRangePicker';

const onDatesChange = jest.fn();

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <DateRangePicker onDatesChange={onDatesChange} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

