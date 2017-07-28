import React from 'react';
import { shallow, mount } from 'enzyme';
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
