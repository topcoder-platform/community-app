import _ from 'lodash';
import Container from 'containers/TopcoderHeader';
import React from 'react';
import R from 'react-test-renderer/shallow';

const mockState = {
  auth: {
    profile: {},
  },
  topcoderHeader: {},
};

test('Matches shallow snapshot', () => {
  const r = new R();
  r.render((
    <Container
      store={{
        dispatch: () => _.noop,
        getState: () => mockState,
        subscribe: _.noop,
      }}
    />
  ));
  expect(r.getRenderOutput()).toMatchSnapshot();
});
