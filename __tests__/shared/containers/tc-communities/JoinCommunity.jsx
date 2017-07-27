import { mount } from 'enzyme';
import React from 'react';
import configureStore from 'redux-mock-store';
import tActions from 'actions/tc-communities';
import JoinCommunity from 'components/tc-communities/JoinCommunity';
import ConnectedJoinCommunity from 'containers/tc-communities/JoinCommunity';

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
        communityName: 'name',
      },
      hideJoinButton: true,
      joinCommunityButton: 'joined',
    },
    stats: {
      groups: {
        1: {},
      },
    },
    auth: {
      profile: {
        groups: [{ id: '1' }],
      },
      tokenV3: 'tokenV3',
    },
  };

  const mockStore = configureStore();
  let store;
  let joinCommunity;

  beforeEach(() => {
    global.fetch = () => Promise.resolve({
      ok: true,
      json: () => ({ result: { status: 200, metadata: {}, content: [] } }),
    });
    store = mockStore(initialState);
    instance = mount(<ConnectedJoinCommunity store={store} />);
    joinCommunity = instance.find(JoinCommunity);
    store.clearActions();
  });

  test('different state', () => {
    const newStore = {
      ...initialState,
      tcCommunities: {
        ...initialState.tcCommunities,
        hideJoinButton: false,
      },
      auth: {
        profile: {},
        tokenV3: 'tokenV3',
      },
    };
    store = mockStore(newStore);
    instance = mount(<ConnectedJoinCommunity store={store} />);
  });

  test('hideJoinButton', () => {
    joinCommunity.prop('hideJoinButton')();
    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0].type).toEqual(tActions.tcCommunity.hideJoinButton.toString());
  });

  test('join', () => {
    joinCommunity.prop('join')();
    const actions = store.getActions();
    expect(actions).toHaveLength(2);
    expect(actions[0].type).toEqual(tActions.tcCommunity.joinInit.toString());
    expect(actions[1].type).toEqual(tActions.tcCommunity.joinDone.toString());
  });

  test('resetJoinButton', () => {
    joinCommunity.prop('resetJoinButton')();
    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0].type).toEqual(tActions.tcCommunity.resetJoinButton.toString());
  });

  test('showJoinConfirmModal', () => {
    joinCommunity.prop('showJoinConfirmModal')();
    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0].type).toEqual(tActions.tcCommunity.showJoinConfirmModal.toString());
  });
});
