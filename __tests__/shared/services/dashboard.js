import { getService } from 'services/dashboard';

describe('dashboard service', () => {
  let service;
  let originalFetch;

  beforeEach(() => {
    service = getService('tokenV3');
  });

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  test('getSubtrackRanks', () => {
    global.fetch = () => Promise.resolve({ ok: true, json: () => ({ result: { status: 400 } }) });
    service.getSubtrackRanks().then((err) => {
      expect(err).toBeInstanceOf(Error);
    });
  });

  test('getSubtrackRanks with data', () => {
    global.fetch = () => Promise.resolve({ ok: true,
      json: () => ({
        result: {
          status: 200,
          content: {
            DEVELOP: {
              challenges: 0,
              wins: 0,
              subTracks: [{
                track: 'DEVELOP',
                subTrack: 'CODE',
                wins: 1,
                submissions: 5,
                mostRecentEventDate: 1500350400000,
                mostRecentSubmission: 1500350400000,
              }, {
                track: 'DEVELOP',
                subTrack: 'ELSE',
                wins: 1,
                submissions: 5,
                rating: 1000,
                mostRecentEventDate: 1500350400000,
                mostRecentSubmission: 1500350400000,
              }, {
                track: 'COPILOT',
                activeContests: 3,
                mostRecentEventDate: 1500350400000,
                mostRecentSubmission: 1500350400000,
              }, {
                track: 'OTHER',
                rating: 1000,
                mostRecentEventDate: 1500350400000,
                mostRecentSubmission: 1500350400000,
              }],
            },
            DESIGN: {
              challenges: 0,
              wins: 0,
              subTracks: [{
                track: 'DESIGN',
                wins: 1,
                submissions: 5,
                mostRecentEventDate: 1500350400000,
                mostRecentSubmission: 1500350400000,
              }, {
                track: 'DESIGN',
                wins: 0,
                submissions: 0,
                mostRecentEventDate: 1500350400000,
                mostRecentSubmission: 1500350400000,
              }],
            },
            DATA_SCIENCE: {
              challenges: 0,
              wins: 0,
              SRM: {},
              MARATHON_MATCH: {},
            },
          },
        },
      }) });
    service.getSubtrackRanks();
  });
});
