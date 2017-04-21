import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import Route from 'routes/examples/DataFetch';

const rnd = new Rnd();

test('Matches snapshot', () => {
  rnd.render((
    <Route />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
