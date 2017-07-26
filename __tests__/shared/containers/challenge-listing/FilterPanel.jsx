import { shallow, mount } from 'enzyme';
import React from 'react';
import configureStore from 'redux-mock-store';
import Select from 'components/Select';
import cActions from 'actions/challenge-listing';
import sActions from 'actions/challenge-listing/sidebar';
import ConnectedFilterPanel, { Container as FilterPanel } from 'containers/challenge-listing/FilterPanel';

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
      communityFilters: [],
      filter: {},
      loadingChallengeTags: false,
      loadingChallengeSubtracks: false,
      challengeTags: [],
      challengeSubtracks: [],
      selectedCommunityId: '1',
    },
    auth: {
      tokenV2: 'tokenV2',
    },
    tcCommunities: {
      list: [
        {
          communityId: '',
          communityName: 'name',
        },
        {
          communityId: '',
          communityName: 'name',
        },
      ],
    },
  };
  const mockStore = configureStore();
  let store;
  let instance;

  beforeEach(() => {
    store = mockStore(initialState);
    instance = shallow(<ConnectedFilterPanel store={store} />);
  });

  test('render', () => {
    expect(instance).toBeDefined();
  });
});

describe('full render pure component', () => {
  const initialProps = {
    expanded: false,
    searchText: '',
    trackModalShown: false,
    activeBucket: 'ALL',
    communityFilters: [],
    filterState: {},
    getAvailableFilterName: jest.fn(),
    loadingKeywords: false,
    loadingSubtracks: false,
    validKeywords: [],
    validSubtracks: [],
    selectedCommunityId: '1',
    tokenV2: 'tokenV2',
    getSubtracks: jest.fn(),
    getKeywords: jest.fn(),
    saveFilter: jest.fn(),
    selectBucket: jest.fn(),
    selectCommunity: jest.fn(),
    setFilterState: jest.fn(),
    setExpanded: jest.fn(),
    setSearchText: jest.fn(),
    showTrackModal: jest.fn(),
    setQuery: jest.fn(),
    onSwitch: jest.fn(),
    tcCommunities: {
      list: [
        {
          communityId: '',
          communityName: 'name',
        },
        {
          communityId: '',
          communityName: 'name',
        },
      ],
    },
  };

  let instance;

  beforeEach(() => {
    instance = mount(<FilterPanel {...initialProps} challengeGroupId="1" />);
    jest.resetAllMocks();
  });

  test('load data if not loading', () => {
    instance = mount(<FilterPanel {...initialProps} challengeGroupId="1" />);
    expect(initialProps.getSubtracks).toHaveBeenCalledTimes(1);
    expect(initialProps.getKeywords).toHaveBeenCalledTimes(1);
  });

  test('do not load data if loading', () => {
    instance = mount(<FilterPanel
      {...initialProps}
      challengeGroupId="1"
      loadingSubtracks
      loadingKeywords
    />);

    expect(initialProps.getSubtracks).toHaveBeenCalledTimes(0);
    expect(initialProps.getKeywords).toHaveBeenCalledTimes(0);
  });

  test('saveFilter', () => {
    const button = instance.find('button.tc-blue-btn');
    expect(initialProps.saveFilter).toHaveBeenCalledTimes(0);
    button.simulate('click');
    expect(initialProps.saveFilter).toHaveBeenCalledTimes(1);
  });

  test('setFilterState and selectBucket', () => {
    const select = instance.find(Select)
      .filterWhere(wrapper => wrapper.prop('id') === 'keyword-select');
    expect(select).toHaveLength(1);
    expect(initialProps.setFilterState).toHaveBeenCalledTimes(0);
    select.prop('onChange')('1');
    expect(initialProps.setFilterState).toHaveBeenCalledTimes(1);
  });
  test('selectBucket', () => {
    instance = mount(<FilterPanel
      {...initialProps}
      challengeGroupId="1"
      activeBucket="saved-filter"
    />);

    const select = instance.find(Select)
      .filterWhere(wrapper => wrapper.prop('id') === 'keyword-select');
    expect(select).toHaveLength(1);
    expect(initialProps.selectBucket).toHaveBeenCalledTimes(0);
    select.prop('onChange')('1');
    expect(initialProps.selectBucket).toHaveBeenCalledTimes(1);
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
        activeBucket: 'ALL',
        savedFilters: [{ name: 'My Filter' }],
      },
      communityFilters: [],
      filter: {},
      loadingChallengeTags: true,
      loadingChallengeSubtracks: true,
      challengeTags: [],
      challengeSubtracks: [],
      selectedCommunityId: '1',
    },
    auth: {
      tokenV2: 'tokenV2',
    },
    tcCommunities: {
      list: [
        {
          communityId: '',
          communityName: 'name',
        },
        {
          communityId: '',
          communityName: 'name',
        },
      ],
    },
  };
  const mockStore = configureStore();
  let store;
  let instance;
  let filterPanel;

  beforeEach(() => {
    global.fetch = () => Promise.resolve({
      ok: true,
      json: () => ({ result: { status: 200, metadata: {}, content: [] } }),
    });
    store = mockStore(initialState);
    instance = mount(<ConnectedFilterPanel store={store} challengeGroupId="1" />);
    filterPanel = instance.find(FilterPanel);
  });

  test('getSubtracks', () => {
    global.fetch = () => Promise.resolve({
      ok: true,
      json: () => ([]),
    });
    filterPanel.prop('getSubtracks')();
    const actions = store.getActions();
    expect(actions[0].type).toEqual(cActions.challengeListing.getChallengeSubtracksInit.toString());
    expect(actions[1].type).toEqual(cActions.challengeListing.getChallengeSubtracksDone.toString());
  });

  test('getKeywords', () => {
    filterPanel.prop('getKeywords')();
    const actions = store.getActions();
    expect(actions[0].type).toEqual(cActions.challengeListing.getChallengeTagsInit.toString());
    expect(actions[1].type).toEqual(cActions.challengeListing.getChallengeTagsDone.toString());
  });

  test('saveFilter', () => {
    filterPanel.prop('saveFilter')();
    const actions = store.getActions();
    expect(actions[0].type).toEqual(sActions.challengeListing.sidebar.saveFilter.toString());
  });

  test('selectBucket', () => {
    filterPanel.prop('selectBucket')();
    const actions = store.getActions();
    expect(actions[0].type).toEqual(sActions.challengeListing.sidebar.selectBucket.toString());
  });

  test('selectCommunity', () => {
    filterPanel.prop('selectCommunity')();
    const actions = store.getActions();
    expect(actions[0].type).toEqual(cActions.challengeListing.selectCommunity.toString());
  });

  test('setFilterState', () => {
    filterPanel.prop('setFilterState')();
    const actions = store.getActions();
    expect(actions[0].type).toEqual(cActions.challengeListing.setFilter.toString());
  });

  test('getAvailableFilterName', () => {
    filterPanel.prop('getAvailableFilterName')();
  });
});
