import actions from 'actions/examples/data-fetch';
import defaultReducer, { factory } from 'reducers/examples/data-fetch';
import { redux } from 'topcoder-react-utils';

const DUMMY_PAYLOAD = 'Dummy Payload 12345';

const fetchFailureMock = jest.fn(() => Promise.reject(new Error('ERROR')));

const fetchSuccessMock = jest.fn(() => Promise.resolve({
  json: () => ({ data: DUMMY_PAYLOAD }),
}));

function testReducer(createReducer, expectedInitialState, factoryFetchMock = fetchSuccessMock) {
  let reducer;
  let state;

  beforeAll(async () => {
    global.fetch = factoryFetchMock;
    reducer = await createReducer();
  });

  test('creates expected initial state', () => {
    state = reducer(undefined, {});
    expect(state).toEqual(expectedInitialState);
  });

  test('properly handles fetch data init', () => {
    state = reducer(state, actions.examples.dataFetch.fetchDataInit());
    expect(state).toEqual({
      data: null,
      failed: false,
      loading: true,
    });
  });

  test('properly handles data loading with success', () => {
    global.fetch = fetchSuccessMock;
    return redux.resolveAction(actions.examples.dataFetch.fetchDataDone()).then((action) => {
      state = reducer(state, action);
      expect(state).toEqual({
        data: DUMMY_PAYLOAD,
        failed: undefined,
        loading: false,
      });
    });
  });

  test('properly handles data loading with failure', () => {
    global.fetch = fetchFailureMock;
    return redux.resolveAction(actions.examples.dataFetch.fetchDataDone()).then((action) => {
      state = reducer(state, action);
      expect(state).toEqual({
        data: null,
        failed: true,
        loading: false,
      });
    });
  });
}

describe('default reducer', () => testReducer(() => defaultReducer, {}));

describe('factory without http request', () => testReducer(() => factory(), {}));

describe('factory with matching http request and success response', () => testReducer(() => factory({
  url: '/examples/data-fetch/server',
}), {
  data: DUMMY_PAYLOAD,
  failed: undefined,
  loading: false,
}));

describe('factory with matching http request and network failure', () => testReducer(() => factory({
  url: '/examples/data-fetch/server',
}), {
  data: null,
  failed: true,
  loading: false,
}, fetchFailureMock));
