import { mount } from 'enzyme';
import React from 'react';
import configureStore from 'redux-mock-store';
import sActions from 'actions/stats';
import ConnectedCommunityStats from 'containers/tc-communities/CommunityStats';

describe('full render connnected component and dispatch actions', () => {
  let originalFetch;
  let instance;

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  afterAll(() => {
    jest.clearAllMocks();
    global.fetch = originalFetch;
    instance.unmount();
  });

  const initialState = {
    tcCommunities: {
      meta: {
        communityId: '1',
      },
    },
    icon: 'lorem',
    stats: {
      communities: {
        1: {
          numChallenges: 1,
          numMembers: 1,
        },
      },
    },
    challengeListing: {
      challenges: [
        {
          name: '',
        },
      ],
    },
    auth: {
      tokenV2: '',
      user: {},
    },
    getCommunityStats: jest.fn(),
    getAllActiveChallenges: jest.fn(),
  };

  const mockStore = configureStore();
  let store;

  beforeEach(() => {
    global.fetch = () => Promise.resolve({
      ok: true,
      json: () => ({ result: { status: 200, metadata: {}, content: [] } }),
    });
    store = mockStore(initialState);
    instance = mount(<ConnectedCommunityStats store={store} />);
  });

  test('getCommunityStats', () => {
    const actions = store.getActions();
    expect(actions[0].type).toEqual(sActions.stats.getCommunityStats.toString());
  });
});
