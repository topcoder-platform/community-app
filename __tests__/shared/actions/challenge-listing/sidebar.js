import sidebarActions from 'actions/challenge-listing/sidebar';

const actions = sidebarActions.challengeListing.sidebar;

const mockFetch = (ok, resolvesTo) => jest.fn(() =>
  Promise.resolve({ ok, json: () => resolvesTo }));

let originalFetch;

beforeAll(() => {
  originalFetch = global.fetch;
});

afterAll(() => {
  global.fetch = originalFetch;
  jest.clearAllMocks();
});

describe('challengeListing.sidebar.changeFilterName', () => {
  const a = actions.changeFilterName('index', 'name');

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING/SIDEBAR/CHANGE_FILTER_NAME');
  });

  test('payload is expected object', () =>
    expect(a.payload).toEqual({
      index: 'index',
      name: 'name',
    }));
});

describe('challengeListing.sidebar.deleteSavedFilter', () => {
  global.fetch = mockFetch(true, 'dummy');

  const a = actions.deleteSavedFilter('id', 'token');

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING/SIDEBAR/DELETE_SAVED_FILTER');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual('id')));
});

describe('challengeListing.sidebar.dragSavedFilterMove', () => {
  const a = actions.dragSavedFilterMove({ target: { offsetHeight: 10 } },
    { y: 0, startIndex: 0, index: 10 });

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING/SIDEBAR/DRAG_SAVED_FILTER_MOVE');
  });

  test('payload is expected object', () =>
    expect(a.payload).toEqual({ y: 0, startIndex: 0, index: 10 }));
});

describe('challengeListing.sidebar.dragSavedFilterMove with screenY', () => {
  const a = actions.dragSavedFilterMove({ screenY: 10, target: { offsetHeight: 10 } },
    { y: 0, startIndex: 0, index: 10 });

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING/SIDEBAR/DRAG_SAVED_FILTER_MOVE');
  });

  test('payload is expected object', () =>
    expect(a.payload).toEqual({ y: 0, startIndex: 0, index: 10, currentIndex: 1 }));
});

describe('challengeListing.sidebar.dragSavedFilterMove same index', () => {
  const a = actions.dragSavedFilterMove({ screenY: 10, target: { offsetHeight: 10 } },
    { y: 0, startIndex: 9, index: 10 });

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING/SIDEBAR/DRAG_SAVED_FILTER_MOVE');
  });

  test('payload is expected object', () =>
    expect(a.payload).toEqual({ y: 0, startIndex: 9, index: 10 }));
});

describe('challengeListing.sidebar.dragSavedFilterStart', () => {
  const a = actions.dragSavedFilterStart(10, { screenY: 5 });

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING/SIDEBAR/DRAG_SAVED_FILTER_START');
  });

  test('payload is expected object', () =>
    expect(a.payload).toEqual({ y: 5, startIndex: 10, currentIndex: 10 }));
});

describe('challengeListing.sidebar.getSavedFilters', () => {
  global.fetch = mockFetch(true, []);

  const a = actions.getSavedFilters('id', 'token');

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING/SIDEBAR/GET_SAVED_FILTERS');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual([])));
});

describe('challengeListing.sidebar.resetFilterName', () => {
  const a = actions.resetFilterName(1);

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING/SIDEBAR/RESET_FILTER_NAME');
  });

  test('payload is expected object', () =>
    expect(a.payload).toEqual(1));
});

describe('challengeListing.sidebar.saveFilter', () => {
  global.fetch = mockFetch(true, 'dummy');

  const a = actions.saveFilter('name', {}, 'token');

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING/SIDEBAR/SAVE_FILTER');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual('dummy')));
});

describe('challengeListing.sidebar.updateAllSavedFilters', () => {
  global.fetch = mockFetch(true, 'dummy');

  const a = actions.updateAllSavedFilters([{ filter: {} }], 'token');

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING/SIDEBAR/UPDATE_ALL_SAVED_FILTERS');
  });

  test('payload is undefined', () =>
    expect(a.payload).toBeUndefined());
});

describe('challengeListing.sidebar.updateSavedFilter', () => {
  global.fetch = mockFetch(true, 'dummy');

  const a = actions.updateSavedFilter({}, 'token');

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING/SIDEBAR/UPDATE_SAVED_FILTER');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual('dummy')));
});
