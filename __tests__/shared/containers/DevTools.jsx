import DevTools from 'containers/DevTools';
import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import { createStore } from 'redux';

const rnd = new Rnd();
const store = createStore(() => ({}), {}, DevTools.instrument());

test('Snapshot match', () => {
  rnd.render((
    <DevTools
      store={store}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
