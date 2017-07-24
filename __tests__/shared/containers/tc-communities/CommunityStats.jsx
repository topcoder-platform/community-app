import { mount } from 'enzyme';
import React from 'react';
import configureStore from 'redux-mock-store';
import sActions from 'actions/stats';
import ConnectedGroupStats, { GroupStatsContainer as GroupStats } from 'containers/tc-communities/CommunityStats';

describe('full render pure component', () => {
  const initialProps = {
    getGroupStats: jest.fn(),
    groupId: '1',
    stats: {},
  };

  let instance;

  beforeEach(() => {
    instance = mount(<GroupStats {...initialProps} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('componentDidMount', () => {
    expect(initialProps.getGroupStats).toHaveBeenCalledTimes(1);
  });

  test('componentWillReceiveProps', () => {
    instance.setProps({ groupId: '1' });
    expect(initialProps.getGroupStats).toHaveBeenCalledTimes(1);
    instance.setProps({ groupId: '2' });
    expect(initialProps.getGroupStats).toHaveBeenCalledTimes(2);
  });
});

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
        challengeGroupId: '1',
      },
    },
    stats: {
      groups: {
        1: {},
      },
    },
    auth: {
      tokenV3: 'tokenV3',
    },
  };

  const mockStore = configureStore();
  let store;

  beforeEach(() => {
    global.fetch = () => Promise.resolve({
      ok: true,
      json: () => ({ result: { status: 200, metadata: {}, content: [] } }),
    });
    store = mockStore(initialState);
    instance = mount(<ConnectedGroupStats store={store} />);
  });

  test('getGroupStats', () => {
    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0].type).toEqual(sActions.stats.getGroupStats.toString());
  });
});
