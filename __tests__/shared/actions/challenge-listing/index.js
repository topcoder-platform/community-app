import qs from 'qs';

jest.setMock('tc-accounts', {
  decodeToken: () => ({
    handle: 'user',
  }),
});

const actions = require('actions/challenge-listing').default.challengeListing;

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

describe('challengeListing.setSort', () => {
  const a = actions.setSort('bucket', 'sort');

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING/SET_SORT');
  });

  test('payload is expected object', () =>
    expect(a.payload).toEqual({
      bucket: 'bucket',
      sort: 'sort',
    }));
});

describe('challengeListing.getAllActiveChallengesInit', () => {
  global.fetch = mockFetch(true, [{ description: 'dummy' }]);

  const a = actions.getAllActiveChallengesInit('dummy');

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING/GET_ALL_ACTIVE_CHALLENGES_INIT');
  });

  test('payload is expected object', () =>
    expect(a.payload).toEqual('dummy'));
});

describe('challengeListing.getDraftChallengesInit', () => {
  global.fetch = mockFetch(true, [{ description: 'dummy' }]);

  const a = actions.getDraftChallengesInit('uuid', 'page');

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING/GET_DRAFT_CHALLENGES_INIT');
  });

  test('payload is expected object', () =>
    expect(a.payload).toEqual({
      uuid: 'uuid',
      page: 'page',
    }));
});

describe('challengeListing.getPastChallengesInit', () => {
  global.fetch = mockFetch(true, [{ description: 'dummy' }]);

  const a = actions.getPastChallengesInit('uuid', 'page');

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING/GET_PAST_CHALLENGES_INIT');
  });

  test('payload is expected object', () =>
    expect(a.payload).toEqual({
      uuid: 'uuid',
      page: 'page',
    }));
});

describe('challengeListing.getChallengeSubtracksDone', () => {
  global.fetch = mockFetch(true, [{ description: 'dummy' }]);

  const a = actions.getChallengeSubtracksDone();

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING/GET_CHALLENGE_SUBTRACKS_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual(['dummy', 'dummy'])));
});

describe('challengeListing.getChallengeTagsDone', () => {
  global.fetch = mockFetch(true, { result: { status: 200, content: [{ name: 'dummy 1' }, { name: 'dummy 2' }] } });

  const a = actions.getChallengeTagsDone();

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING/GET_CHALLENGE_TAGS_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual(['dummy 1', 'dummy 2'])));
});

describe('challengeListing.getAllActiveChallengesDone without token', () => {
  global.fetch = mockFetch(true, {
    result: {
      status: 200,
      content: [],
      metadata: {
        totalCount: 2,
      },
    },
  });

  const a = actions.getAllActiveChallengesDone('uuid');

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING/GET_ALL_ACTIVE_CHALLENGES_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual({ challenges: [], uuid: 'uuid' })));
});

describe('challengeListing.getAllActiveChallengesDone with token', () => {
  global.fetch = jest.fn((url) => {
    const query = qs.parse(url.substr(url.indexOf('?') + 1));
    const result = {
      status: 200,
      metadata: {
        totalCount: 2,
      },
    };

    if (query.offset === '0') {
      result.content = [{
        id: '1',
        allPhases: [{
          phaseType: 'Registration',
          phaseStatus: 'Open',
        }],
        groupIds: [],
        totalPrize: 0,
      }, {
        id: '2',
        allPhases: [{
          phaseType: 'Registration',
          phaseStatus: 'Open',
        }],
        groupIds: [],
        totalPrize: 0,
      }];
      if (url.match('/members/user/')) {
        result.content.pop();
      }
    } else {
      result.content = [];
    }

    return Promise.resolve({
      ok: true,
      json: () => ({ result }),
    });
  });

  const a = actions.getAllActiveChallengesDone('uuid', 'token');

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING/GET_ALL_ACTIVE_CHALLENGES_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res.challenges).toHaveLength(4)));
});

describe('challengeListing.getDraftChallengesDone', () => {
  global.fetch = mockFetch(true, {
    result: {
      status: 200,
      content: [],
      metadata: {
        totalCount: 2,
      },
    },
  });

  const a = actions.getDraftChallengesDone('uuid');

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING/GET_DRAFT_CHALLENGES_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual({ challenges: [], uuid: 'uuid' })));
});

describe('challengeListing.getPastChallengesDone', () => {
  global.fetch = mockFetch(true, {
    result: {
      status: 200,
      content: [],
      metadata: {
        totalCount: 2,
      },
    },
  });

  const a = actions.getPastChallengesDone('uuid');

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE_LISTING/GET_PAST_CHALLENGES_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual({ challenges: [], uuid: 'uuid' })));
});
