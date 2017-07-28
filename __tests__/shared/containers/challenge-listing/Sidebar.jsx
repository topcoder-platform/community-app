import { shallow, mount } from 'enzyme';
import React from 'react';
import configureStore from 'redux-mock-store';
import cActions from 'actions/challenge-listing';
import fActions from 'actions/challenge-listing/filter-panel';
import ConnectedSidebar, { SidebarPureComponent as Sidebar } from 'containers/challenge-listing/Sidebar';

describe('shallow render connnected component', () => {
  const initialState = {
    challengeListing: {
      filterPanel: {
        expanded: false,
        searchText: '',
        trackModalShown: false,
      },
      sidebar: {
        activeBucket: 'ALL',
        savedFilters: [],
      },
      challenges: [],
      pendingRequests: {},
      communityFilters: [],
      filter: {},
      selectedCommunityId: '1',
    },
    tcCommunities: {
      list: [
        {
          communityId: '',
          communityName: 'name',
        },
      ],
    },
    auth: {
      tokenV2: 'tokenV2',
      user: {},
    },
  };
  const mockStore = configureStore();
  let store;
  let instance;

  beforeEach(() => {
    store = mockStore(initialState);
    instance = shallow(<ConnectedSidebar store={store} />);
  });

  test('render', () => {
    expect(instance).toHaveLength(1);
  });
});

describe('full render connnected component and dispatch actions', () => {
  let originalFetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  const initialState = {
    challengeListing: {
      filterPanel: {
        expanded: false,
        searchText: '',
        trackModalShown: false,
      },
      sidebar: {
        activeBucket: 'all',
        savedFilters: [],
        activeSavedFilter: 1,
        editSavedFiltersMode: false,
      },
      challenges: [],
      pendingRequests: {},
      communityFilters: [],
      filter: {},
      selectedCommunityId: '1',
    },
    tcCommunities: {
      list: [
        {
          communityId: '',
          communityName: 'name',
        },
      ],
    },
    auth: {
      tokenV2: '',
      user: {},
    },
  };
  const mockStore = configureStore();
  let store;
  let instance;
  let sidebar;

  beforeEach(() => {
    global.fetch = () => Promise.resolve({
      ok: true,
      json: () => ({ result: { status: 200, metadata: {}, content: [] } }),
    });
    store = mockStore(initialState);
    instance = mount(<ConnectedSidebar store={store} />);
    sidebar = instance.find(Sidebar);
  });

  test('setFilter', () => {
    sidebar.prop('setFilter')();
    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0].type).toEqual(cActions.challengeListing.setFilter.toString());
  });

  test('setSearchText', () => {
    sidebar.prop('setSearchText')();
    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0].type).toEqual(fActions.challengeListing.filterPanel.setSearchText.toString());
  });
});
