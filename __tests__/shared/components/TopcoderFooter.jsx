import React from 'react';
import Rnd from 'react-test-renderer';
import TopcoderFooter from 'components/TopcoderFooter';

test('Matches shallow shapshot', () => {
  const rnd = Rnd.create(<TopcoderFooter />);
  expect(rnd.toJSON()).toMatchSnapshot();
});
