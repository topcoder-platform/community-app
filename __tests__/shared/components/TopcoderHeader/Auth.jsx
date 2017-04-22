import Auth from 'components/TopcoderHeader/Auth';
import React from 'react';
import Rnd from 'react-test-renderer/shallow';

const rnd = new Rnd();

test('Snapshot match', () => {
  rnd.render((
    <Auth />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
  rnd.render((
    <Auth column />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
