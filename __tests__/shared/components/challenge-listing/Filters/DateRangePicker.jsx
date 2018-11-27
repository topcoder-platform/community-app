import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import DateRangePicker from 'components/challenge-listing/Filters/DateRangePicker';

const requiredProps = {
  onDatesChange: () => {},
  onFocusChange: () => {},
  startDateId: 'startDate',
  endDateId: 'endDate',
};

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <DateRangePicker {...requiredProps} />
  ));
  expect(renderer.getRenderOutput()).not.toBeNull();
});
