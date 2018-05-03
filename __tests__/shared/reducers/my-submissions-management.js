import actions from 'actions/smp';
import defaultReducer, { factory } from 'reducers/my-submissions-management';

let reducer;

const mockFetch = (resolvesTo) => {
  global.fetch = jest.fn(() => Promise.resolve({ json: () => resolvesTo }));
};

function testReducer(expectedInitialState) {
  let state;

  test('creates expected initial state', () => {
    state = reducer(undefined, {});
    expect(state).toEqual(expectedInitialState);
  });

  test('properly handles showDetails', () => {
    state = reducer(state, actions.smp.showDetails(1));
    expect(state.showDetails.has(1)).toBeTruthy();

    state = reducer(state, actions.smp.showDetails(1));
    expect(state.showDetails.has(1)).toBeFalsy();
  });

  test('properly handles delete confirm', () => {
    state = reducer(state, actions.smp.confirmDelete('TO_BE_DELETED'));

    expect(state.showModal).toBeTruthy();
    expect(state.toBeDeletedId).toEqual('TO_BE_DELETED');
  });

  test('properly handles delete cancel', () => {
    state = reducer(state, actions.smp.cancelDelete());

    expect(state.showModal).toBeFalsy();
    expect(state.toBeDeletedId).toEqual(0);
  });

  test('properly handles delete done', () => {
    state = reducer(state, actions.smp.confirmDelete('TO_BE_DELETED'));
    state = reducer(state, actions.smp.deleteSubmissionDone());

    expect(state.showModal).toBeFalsy();
    expect(state.toBeDeletedId).toEqual(0);
  });
}

describe('default reducer', () => {
  mockFetch({});
  beforeAll(() => defaultReducer.then((res) => { reducer = res; }));

  testReducer({
    showDetails: [],
    showModal: false,
    toBeDeletedId: 0,
  });
});

describe('factory without http request', () => {
  mockFetch({});
  beforeAll(() => factory().then((res) => { reducer = res; }));

  testReducer({
    showDetails: [],
    showModal: false,
    toBeDeletedId: 0,
  });
});
