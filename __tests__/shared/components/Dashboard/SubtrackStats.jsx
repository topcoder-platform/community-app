import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import ReactDOM from 'react-dom';
import SubtrackStats from 'components/Dashboard/SubtrackStats';

/* global document, window */

const mockData = {
  subtracks: [
    {
      track: 'DEVELOP',
      subtrack: 'CODE',
      stat: 1000,
    },
    {
      track: 'DESIGN',
      subtrack: 'DESIGN',
      stat: 1000,
    },
  ],
  handle: 'handle',
};

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <SubtrackStats {...mockData} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});


describe('handler resize', () => {
  const container = document.createElement('div');
  let instance;

  beforeEach(() => {
    instance = ReactDOM.render(<SubtrackStats {...mockData} />, container);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
  });

  test('resize to 1920', () => {
    window.resizeTo(1920, 1280);
    expect(instance.state.width).toEqual(1920);
  });

  test('resize to 1280', () => {
    window.resizeTo(1280, 960);
    expect(instance.state.width).toEqual(1280);
  });
});
