const defaultReducer = require('reducers/challenge-listing/sidebar').default;

const expectedState = {
  activeBucket: 'openForRegistration',
  past: false,
};

function testReducer(reducer) {
  test('creates expected initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(expectedState);
  });
}

describe('default reducer', () => testReducer(defaultReducer));
