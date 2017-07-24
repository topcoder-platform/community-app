import { shallow, mount } from 'enzyme';
import React from 'react';
import configureStore from 'redux-mock-store';
import cActions from 'actions/challenge-listing';
import fActions from 'actions/challenge-listing/filter-panel';
import ConnectedSidebar, { SidebarContainer as Sidebar } from 'containers/challenge-listing/Sidebar';
import FiltersEditor from 'components/challenge-listing/Sidebar/FiltersEditor';
import BucketSelector from 'components/challenge-listing/Sidebar/BucketSelector';

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

describe('full render pure component', () => {
  const initialProps = {
    communityFilters: [],
    deleteSavedFilter: jest.fn(),
    getSavedFilters: jest.fn(),
    savedFilters: [{ id: '1', name: 'My Filter', filter: {} }],
    selectedCommunityId: '1',
    selectSavedFilter: jest.fn(),
    setFilter: jest.fn(),
    setSearchText: jest.fn(),
    tokenV2: '',
    updateAllSavedFilters: jest.fn(),
    updateSavedFilter: jest.fn(),
    user: {},
    activeBucket: 'ALL',
    challenges: [],
    changeFilterName: jest.fn(),
    dragSavedFilterMove: jest.fn(),
    dragSavedFilterStart: jest.fn(),
    editSavedFiltersMode: true,
    filterState: {},
    resetFilterName: jest.fn(),
    selectBucket: jest.fn(),
    setEditSavedFiltersMode: jest.fn(),
    activeSavedFilter: 1,
  };

  let instance;

  beforeEach(() => {
    instance = mount(<Sidebar {...initialProps} />);
    jest.resetAllMocks();
  });

  test('initial props', () => {
    instance = mount(<Sidebar {...initialProps} />);
    expect(initialProps.getSavedFilters).toHaveBeenCalledTimes(0);
  });

  test('with different props', () => {
    instance = mount(<Sidebar
      {...initialProps}
      tokenV2="tokenV2"
      communityFilters={[{ id: '1' }]}
    />);
    expect(initialProps.getSavedFilters).toHaveBeenCalledTimes(1);
  });

  test('props pass to FiltersEditor', () => {
    const editor = instance.find(FiltersEditor);
    expect(editor).toHaveLength(1);
    editor.prop('deleteSavedFilter')();
    expect(initialProps.deleteSavedFilter).toHaveBeenCalledTimes(1);

    editor.prop('updateAllSavedFilters')();
    expect(initialProps.updateAllSavedFilters).toHaveBeenCalledTimes(1);

    editor.prop('updateSavedFilter')();
    expect(initialProps.updateSavedFilter).toHaveBeenCalledTimes(1);
  });

  test('props pass to BucketSelector', () => {
    instance = mount(<Sidebar {...initialProps} editSavedFiltersMode={false} />);
    const selector = instance.find(BucketSelector);
    expect(selector).toHaveLength(1);
    selector.prop('selectSavedFilter')(0);
    expect(initialProps.selectSavedFilter).toHaveBeenCalledTimes(1);
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
