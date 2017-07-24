import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import ConnectedDashboard, { DashboardPageContainer as Dashboard } from 'containers/Dashboard';
import dActions from 'actions/dashboard';
import cActions from 'actions/challenge-listing';

describe('shallow render connnected component', () => {
  const initialState = {
    auth: {},
    dashboard: {},
    challengeListing: {},
  };
  const mockStore = configureStore();
  let store;
  let instance;

  beforeEach(() => {
    store = mockStore(initialState);
    instance = shallow(<ConnectedDashboard store={store} />);
  });

  test('render', () => {
    expect(instance).toHaveLength(1);
  });

  test('props match', () => {
    expect(instance.prop('auth')).toEqual(initialState.auth);
    expect(instance.prop('dashboard')).toEqual(initialState.dashboard);
    expect(instance.prop('challengeListing')).toEqual(initialState.challengeListing);
  });
});

describe('full render pure component', () => {
  const initialProps = {
    auth: {
      user: {
      },
    },
    dashboard: {
      iosRegistered: false,
    },
    challengeListing: {
      challenges: [],
    },
    getSubtrackRanks: jest.fn(),
    getAllActiveChallenges: jest.fn(),
    getSRMs: jest.fn(),
    getIosRegistration: jest.fn(),
    registerIos: jest.fn(),
    getBlogs: jest.fn(),
    getUserFinancials: jest.fn(),
  };

  let instance;

  beforeEach(() => {
    instance = mount(<Dashboard {...initialProps} />);
    jest.resetAllMocks();
  });

  test('with tokenV2', () => {
    instance = mount(<Dashboard {...initialProps} auth={{ tokenV2: 'tokenV2' }} />);
    expect(initialProps.getAllActiveChallenges).toHaveBeenCalledTimes(1);
    expect(initialProps.getBlogs).toHaveBeenCalledTimes(1);
  });

  test('without tokenV2', () => {
    const spy = sinon.spy(Dashboard.prototype, 'componentDidUpdate');

    instance.setProps({
      auth: {
        user: {
          handle: 'handle',
        },
        profile: {
          maxRating: {},
          groups: [],
        },
      },
    });

    expect(spy.calledOnce).toEqual(true);
    expect(initialProps.getAllActiveChallenges).toHaveBeenCalledTimes(0);
    expect(initialProps.getSubtrackRanks).toHaveBeenCalledTimes(0);
    expect(initialProps.getSRMs).toHaveBeenCalledTimes(0);
    expect(initialProps.getIosRegistration).toHaveBeenCalledTimes(0);
    expect(initialProps.getUserFinancials).toHaveBeenCalledTimes(0);

    instance.setProps({
      auth: {
        tokenV3: 'tokenV3',
        user: {
          handle: 'handle',
        },
      },
      challengeListing: {
        loadingActiveChallengesUUID: 'uuid',
        challenges: [{
          id: '1',
          users: {},
        }],
      },
      dashboard: {
        loadingSubtrackRanks: true,
        loadingSRMs: true,
        loadingBlogs: true,
        iosRegistered: false,
      },
    });

    expect(spy.calledTwice).toEqual(true);
    setImmediate(() => {
      expect(initialProps.getAllActiveChallenges).toHaveBeenCalledTimes(1);
      expect(initialProps.getSubtrackRanks).toHaveBeenCalledTimes(1);
      expect(initialProps.getSRMs).toHaveBeenCalledTimes(1);
      expect(initialProps.getIosRegistration).toHaveBeenCalledTimes(1);
      expect(initialProps.getUserFinancials).toHaveBeenCalledTimes(1);
    });

    spy.restore();
  });

  test('register ios', () => {
    const matches = instance.find('a[title="Participate"]');
    expect(matches).toHaveLength(1);
    matches.simulate('click');
    expect(initialProps.registerIos).toHaveBeenCalledTimes(1);
  });
});

describe('full render connnected component and dispatch actions', () => {
  let originalFetch;

  beforeAll(() => {
    originalFetch = global.fetch;
    global.fetch = () => Promise.resolve({
      ok: true,
      json: () => ({ result: { status: 200, metadata: {}, content: [] } }),
      text: () => ('<rss><channel><item></item><item></item></channel></rss>'),
    });
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  const initialState = {
    auth: {},
    dashboard: {
      iosRegistered: false,
    },
    challengeListing: {},
  };
  const mockStore = configureStore();
  let store;
  let instance;
  let dashboard;

  beforeEach(() => {
    store = mockStore(initialState);
    instance = mount(<ConnectedDashboard store={store} />);
    dashboard = instance.find(Dashboard);
  });

  test('getSubtrackRanks', () => {
    dashboard.prop('getSubtrackRanks')();
    const actions = store.getActions();
    expect(actions[0].type).toEqual(dActions.dashboard.getSubtrackRanksInit.toString());
    expect(actions[1].type).toEqual(dActions.dashboard.getSubtrackRanksDone.toString());
  });

  test('getAllActiveChallenges', () => {
    dashboard.prop('getAllActiveChallenges')();
    const actions = store.getActions();
    expect(actions[0].type).toEqual(
      cActions.challengeListing.getAllActiveChallengesInit.toString());
    expect(actions[1].type).toEqual(
      cActions.challengeListing.getAllActiveChallengesDone.toString());
  });

  test('getSRMs', () => {
    dashboard.prop('getSRMs')();
    const actions = store.getActions();
    expect(actions[0].type).toEqual(dActions.dashboard.getSrmsInit.toString());
    expect(actions[1].type).toEqual(dActions.dashboard.getSrmsDone.toString());
  });

  test('getIosRegistration', () => {
    dashboard.prop('getIosRegistration')();
    const actions = store.getActions();
    expect(actions[0].type).toEqual(dActions.dashboard.getIosRegistration.toString());
  });

  test('registerIos', () => {
    dashboard.prop('registerIos')();
    const actions = store.getActions();
    expect(actions[0].type).toEqual(dActions.dashboard.registerIos.toString());
  });

  test('getBlogs', () => {
    dashboard.prop('getBlogs')();
    const actions = store.getActions();
    expect(actions[0].type).toEqual(dActions.dashboard.getBlogsInit.toString());
    expect(actions[1].type).toEqual(dActions.dashboard.getBlogsDone.toString());
  });

  test('getUserFinancials', () => {
    dashboard.prop('getUserFinancials')();
    const actions = store.getActions();
    expect(actions[0].type).toEqual(dActions.dashboard.getUserFinancials.toString());
  });
});

