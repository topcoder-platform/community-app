import _ from 'lodash';
import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import Routes from 'routes';

const mockState = {
  auth: {
    subdomains: [],
  },
};

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <Routes
      store={{
        dispatch: () => _.noop,
        getState: () => mockState,
        subscribe: _.noop,
      }}
    />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
