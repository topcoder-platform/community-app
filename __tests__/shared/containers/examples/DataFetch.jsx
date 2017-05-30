import _ from 'lodash';
import React from 'react';
import renderer from 'react-test-renderer';

jest.setMock(require.resolve('actions/examples/data-fetch'), {
  examples: {
    dataFetch: {
      fetchDataInit: _.noop,
      fetchDataDone: _.noop,
    },
  },
});

const DataFetch = require('containers/examples/DataFetch').default;

const mockState = {
  examples: {
    dataFetch: {},
  },
};

test('Matches shallow shapshot', () => {
  const container = renderer.create((
    <DataFetch
      store={{
        dispatch: () => _.noop,
        getState: () => mockState,
        subscribe: _.noop,
      }}
    />
  ));
  expect(container.toJSON()).toMatchSnapshot();
});
