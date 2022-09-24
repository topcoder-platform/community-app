/* global window */

import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import Content from 'components/Content';

beforeAll(() => {
  window.TRU_BUILD_INFO = {
    timestamp: 'Wed, 29 Nov 2017 07:40:00 GMT',
  };
});

afterAll(() => delete window.TRU_BUILD_INFO);

//test('Matches shallow shapshot', () => {
//  const renderer = new Renderer();
//  renderer.render(<Content />);
//  expect(renderer.getRenderOutput()).toMatchSnapshot();
//});
