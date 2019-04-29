import sidebarActions from 'actions/challenge-listing/sidebar';

const actions = sidebarActions.challengeListingFrontend.sidebar;

const mockFetch = (ok, resolvesTo) => jest.fn(
  () => Promise.resolve({ ok, json: () => resolvesTo }),
);

let originalFetch;

beforeAll(() => {
  originalFetch = global.fetch;
});

afterAll(() => {
  global.fetch = originalFetch;
  jest.clearAllMocks();
});

describe('challengeListingFront.sidebar.changeFilterName', () => {
  const a = actions.changeFilterName('index', 'name');

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING_FRONTEND/SIDEBAR/CHANGE_FILTER_NAME');
  });

  test('payload is expected object', () => expect(a.payload).toEqual({
    index: 'index',
    name: 'name',
  }));
});

describe('challengeListingFrontend.sidebar.deleteSavedFilter', () => {
  global.fetch = mockFetch(true, 'dummy');

  const a = actions.deleteSavedFilter('id', 'token');

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING_FRONTEND/SIDEBAR/DELETE_SAVED_FILTER');
  });

  test('payload is a promise which resolves to the expected object', () => a.payload.then(res => expect(res).toEqual('id')));
});

describe('challengeListingFrontend.sidebar.dragSavedFilterMove', () => {
  const a = actions.dragSavedFilterMove(
    { target: { offsetHeight: 10 } },
    { y: 0, startIndex: 0, index: 10 },
  );

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING_FRONTEND/SIDEBAR/DRAG_SAVED_FILTER_MOVE');
  });

  test('payload is expected object', () => expect(a.payload).toEqual({ y: 0, startIndex: 0, index: 10 }));
});

describe('challengeListingFrontend.sidebar.dragSavedFilterMove with screenY', () => {
  const a = actions.dragSavedFilterMove(
    { screenY: 10, target: { offsetHeight: 10 } },
    { y: 0, startIndex: 0, index: 10 },
  );

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING_FRONTEND/SIDEBAR/DRAG_SAVED_FILTER_MOVE');
  });

  test('payload is expected object', () => expect(a.payload).toEqual({
    y: 0, startIndex: 0, index: 10, currentIndex: 1,
  }));
});

describe('challengeListingFrontend.sidebar.dragSavedFilterMove same index', () => {
  const a = actions.dragSavedFilterMove(
    { screenY: 10, target: { offsetHeight: 10 } },
    { y: 0, startIndex: 9, index: 10 },
  );

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING_FRONTEND/SIDEBAR/DRAG_SAVED_FILTER_MOVE');
  });

  test('payload is expected object', () => expect(a.payload).toEqual({ y: 0, startIndex: 9, index: 10 }));
});

describe('challengeListingFrontend.sidebar.dragSavedFilterStart', () => {
  const a = actions.dragSavedFilterStart(10, { screenY: 5 });

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING_FRONTEND/SIDEBAR/DRAG_SAVED_FILTER_START');
  });

  test('payload is expected object', () => expect(a.payload).toEqual({ y: 5, startIndex: 10, currentIndex: 10 }));
});

describe('challengeListingFrontend.sidebar.getSavedFilters', () => {
  global.fetch = mockFetch(true, []);

  const a = actions.getSavedFilters('id', 'token');

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING_FRONTEND/SIDEBAR/GET_SAVED_FILTERS');
  });

  // FIXME: Broken in topcoder-react-lib v0.3.0
  // test('payload is a promise which resolves to the expected object', () =>
  //   a.payload.then(res => expect(res).toEqual([])));
});

describe('challengeListingFrontend.sidebar.resetFilterName', () => {
  const a = actions.resetFilterName(1);

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING_FRONTEND/SIDEBAR/RESET_FILTER_NAME');
  });

  test('payload is expected object', () => expect(a.payload).toEqual(1));
});

describe('challengeListingFrontend.sidebar.saveFilter', () => {
  global.fetch = mockFetch(true, 'dummy');

  const a = actions.saveFilterDone('name', {}, 'token');

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING_FRONTEND/SIDEBAR/SAVE_FILTER_DONE');
  });

  // FIXME: Broken in topcoder-react-lib v0.3.0
  // test('payload is a promise which resolves to the expected object', () =>
  // a.payload.then(res => expect(res).toEqual('dummy')));
});

describe('challengeListingFrontend.sidebar.updateAllSavedFilters', () => {
  global.fetch = mockFetch(true, 'dummy');

  const a = actions.updateAllSavedFilters([{ filter: {} }], 'token');

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING_FRONTEND/SIDEBAR/UPDATE_ALL_SAVED_FILTERS');
  });

  test('payload is undefined', () => expect(a.payload).toBeUndefined());
});

describe('challengeListingFrontend.sidebar.updateSavedFilter', () => {
  global.fetch = mockFetch(true, 'dummy');

  const a = actions.updateSavedFilter({}, 'token');

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING_FRONTEND/SIDEBAR/UPDATE_SAVED_FILTER');
  });

  // FIXME: Broken in topcoder-react-lib v0.3.0
  // test('payload is a promise which resolves to the expected object', () =>
  // a.payload.then(res => expect(res).toEqual('dummy')));
});
