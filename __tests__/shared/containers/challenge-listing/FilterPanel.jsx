import { shallow, mount } from 'enzyme';
import React from 'react';
import configureStore from 'redux-mock-store';
import Select from 'components/Select';
import { actions as actionsLib } from 'topcoder-react-lib';
import sActions from 'actions/challenge-listing/sidebar';
import ConnectedFilterPanel, { Container as FilterPanel } from 'containers/challenge-listing/FilterPanel';

const cActions = actionsLib.challengeListing;

describe('shallow render connnected component', () => {
  const initialState = {
    challengeListingFrontend: {
      filterPanel: {
        expanded: false,
        searchText: '',
        trackModalShown: false,
      },
      sidebar: {
        activeBucket: 'ALL',
        savedFilters: [],
      },
    },
    challengeListing: {
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
      list: {
        data: [
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
    challengeListingFrontend: {
      filterPanel: {
        expanded: false,
        searchText: '',
        trackModalShown: false,
        setExpanded: jest.fn(),
        setSearchText: jest.fn(),
        showTrackModal: jest.fn(),
      },
      sidebar: {
        activeBucket: 'ALL',
        saveFilter: jest.fn(),
        selectBucket: jest.fn(),
      },
    },
    challengeListing: {
      selectedCommunityId: '1',
      loadingKeywords: false,
      loadingSubtracks: false,
      selectCommunity: jest.fn(),
      communityFilters: [],
      challengeTags: [],
    },
    auth: {
      tokenV2: 'tokenV2',
    },
    filterState: {},
    validKeywords: ['.NET', 'CSS', 'Node.js'],
    validSubtracks: [
      {
        description: 'Bug Hunt',
        id: 9,
        name: 'Bug Hunt',
        subTrack: 'BUG_HUNT',
        type: 'Application',
      },
      {
        description: 'Code',
        id: 39,
        name: 'Code',
        subTrack: 'CODE',
        type: 'Application',
      },
    ],
    getSubtracks: jest.fn(),
    getKeywords: jest.fn(),
    getAvailableFilterName: jest.fn(),
    setFilterState: jest.fn(),
    selectBucket: jest.fn(),
    setQuery: jest.fn(),
    onSwitch: jest.fn(),
    communityFilters: [
      {
        communityId: '',
        communityName: 'name',
      },
      {
        communityId: '',
        communityName: 'name',
      },
    ],
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

  test.skip('saveFilter', () => {
    const button = instance.find('button.tc-blue-btn');
    expect(initialProps.saveFilter).toHaveBeenCalledTimes(0);
    button.simulate('click');
    expect(initialProps.saveFilter).toHaveBeenCalledTimes(0);
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
    challengeListingFrontend: {
      filterPanel: {
        expanded: false,
        searchText: '',
        trackModalShown: false,
      },
      sidebar: {
        activeBucket: 'ALL',
        savedFilters: [{ name: 'My Filter' }],
      },
    },
    challengeListing: {
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
      list: {
        data: [
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
    expect(actions[0].type).toEqual(cActions.getChallengeSubtracksInit.toString());
    expect(actions[1].type).toEqual(cActions.getChallengeSubtracksDone.toString());
  });

  test('getKeywords', () => {
    filterPanel.prop('getKeywords')();
    const actions = store.getActions();
    expect(actions[0].type).toEqual(cActions.getChallengeTagsInit.toString());
    expect(actions[1].type).toEqual(cActions.getChallengeTagsDone.toString());
  });

  test.skip('saveFilter', () => {
    filterPanel.prop('saveFilter')();
    const actions = store.getActions();
    expect(actions[0].type).toEqual(
      sActions.challengeListingFrontend.sidebar.saveFilterInit.toString(),
    );
  });

  test('selectBucket', () => {
    filterPanel.prop('selectBucket')();
    const actions = store.getActions();
    expect(actions[0].type).toEqual(
      sActions.challengeListingFrontend.sidebar.selectBucket.toString(),
    );
  });

  test('selectCommunity', () => {
    filterPanel.prop('selectCommunity')();
    const actions = store.getActions();
    expect(actions[0].type).toEqual(cActions.selectCommunity.toString());
  });

  test('setFilterState', () => {
    filterPanel.prop('setFilterState')();
    const actions = store.getActions();
    expect(actions[0].type).toEqual(cActions.setFilter.toString());
  });
});
