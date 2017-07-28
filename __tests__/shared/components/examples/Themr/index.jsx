/* global document */

import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import ReactDOM from 'react-dom';
import Themr from 'components/examples/Themr';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <Themr />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

test('mount/unmount', () => {
  const container = document.createElement('div');
  ReactDOM.render(<Themr />, container);
  ReactDOM.unmountComponentAtNode(container);
});
