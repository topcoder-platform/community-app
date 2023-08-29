// import { shallow, mount } from 'enzyme';
import { shallow } from 'enzyme';
import React from 'react';
import configureStore from 'redux-mock-store';
// import Select from 'components/Select';
// import cActions from 'actions/challenge-listing';
// import sActions from 'actions/challenge-listing/sidebar';
// import ConnectedFilterPanel, { Container as FilterPanel }
// from 'containers/challenge-listing/FilterPanel';
import ConnectedFilterPanel from 'containers/challenge-listing/FilterPanel';

describe('shallow render connnected component', () => {
  const initialState = {
    challengeListing: {
      filterPanel: {
        expanded: false,
        searchText: '',
        trackModalShown: false,
      },
      sidebar: {
        activeBucket: 'all',
        // savedFilters: [],
      },
      communityFilters: [],
      filter: {},
      loadingChallengeTypes: false,
      challengeTypes: [],
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
// describe('full render pure component', () => {
// const initialProps = {
//   expanded: false,
//   searchText: '',
//   trackModalShown: false,
//   activeBucket: 'all',
//   communityFilters: [],
//   filterState: {},
//   getAvailableFilterName: jest.fn(),
//   loadingTypes: false,
//   validTypes: [],
//   selectedCommunityId: '1',
//   tokenV2: 'tokenV2',
//   getTypes: jest.fn(),
//   saveFilter: jest.fn(),
//   selectBucket: jest.fn(),
//   selectCommunity: jest.fn(),
//   setFilterState: jest.fn(),
//   setExpanded: jest.fn(),
//   setSearchText: jest.fn(),
//   showTrackModal: jest.fn(),
//   setQuery: jest.fn(),
//   onSwitch: jest.fn(),
//   tcCommunities: {
//     list: {
//       data: [
//         {
//           communityId: '',
//           communityName: 'name',
//         },
//         {
//           communityId: '',
//           communityName: 'name',
//         },
//       ],
//     },
//   },
// };

// let instance;

// beforeEach(() => {
//   instance = mount(<FilterPanel {...initialProps} challengeGroupId="1" />);
//   jest.resetAllMocks();
// });

// test('load data if not loading', () => {
//   instance = mount(<FilterPanel {...initialProps} challengeGroupId="1" />);
//   expect(initialProps.getTypes).toHaveBeenCalledTimes(1);
// });

// test('do not load data if loading', () => {
//   instance = mount(<FilterPanel
//     {...initialProps}
//     challengeGroupId="1"
//     loadingTypes
//   />);

//   expect(initialProps.getTypes).toHaveBeenCalledTimes(0);
// });

// test.skip('saveFilter', () => {
//   const button = instance.find('button.tc-blue-btn');
//   expect(initialProps.saveFilter).toHaveBeenCalledTimes(0);
//   button.simulate('click');
//   expect(initialProps.saveFilter).toHaveBeenCalledTimes(0);
// });

// test('setFilterState and selectBucket', () => {
//   const select = instance.find(Select)
//     .filterWhere(wrapper => wrapper.prop('id') === 'keyword-select');
//   expect(select).toHaveLength(1);
//   expect(initialProps.setFilterState).toHaveBeenCalledTimes(0);
//   select.prop('onChange')('1');
//   expect(initialProps.setFilterState).toHaveBeenCalledTimes(1);
// });
// test('selectBucket', () => {
//   instance = mount(<FilterPanel
//     {...initialProps}
//     challengeGroupId="1"
//     activeBucket="saved-filter"
//   />);

//   const select = instance.find(Select)
//     .filterWhere(wrapper => wrapper.prop('id') === 'keyword-select');
//   expect(select).toHaveLength(1);
//   expect(initialProps.selectBucket).toHaveBeenCalledTimes(0);
//   select.prop('onChange')('1');
//   expect(initialProps.selectBucket).toHaveBeenCalledTimes(1);
// });
// });

// describe('full render connnected component and dispatch actions', () => {
//   let originalFetch;

//   beforeAll(() => {
//     originalFetch = global.fetch;
//   });

//   afterAll(() => {
//     global.fetch = originalFetch;
//   });

//   const initialState = {
//     challengeListing: {
//       filterPanel: {
//         expanded: false,
//         searchText: '',
//         trackModalShown: false,
//       },
//       sidebar: {
//         activeBucket: 'all',
//         // savedFilters: [{ name: 'My Filter' }],
//       },
//       communityFilters: [],
//       filter: {},
//       loadingChallengeTypes: true,
//       challengeTypes: [],
//       selectedCommunityId: '1',
//     },
//     auth: {
//       tokenV2: 'tokenV2',
//     },
//     tcCommunities: {
//       list: {
//         data: [
//           {
//             communityId: '',
//             communityName: 'name',
//           },
//           {
//             communityId: '',
//             communityName: 'name',
//           },
//         ],
//       },
//     },
//   };
//   const mockStore = configureStore();
//   let store;
//   let instance;
//   let filterPanel;

//   beforeEach(() => {
//     global.fetch = () => Promise.resolve({
//       ok: true,
//       json: () => ({ result: { status: 200, metadata: {}, content: [] } }),
//     });
//     store = mockStore(initialState);
//     instance = mount(<ConnectedFilterPanel store={store} challengeGroupId="1" />);
//     filterPanel = instance.find(FilterPanel);
//   });

//   test('getTypes', () => {
//     global.fetch = () => Promise.resolve({
//       ok: true,
//       json: () => ([]),
//     });
//     filterPanel.prop('getTypes')();
//     const actions = store.getActions();
//     expect(actions[0].type).toEqual(cActions.challengeListing.getChallengeTypesInit.toString());
//     expect(actions[1].type).toEqual(cActions.challengeListing.getChallengeTypesDone.toString());
//   });

// test.skip('saveFilter', () => {
//   filterPanel.prop('saveFilter')();
//   const actions = store.getActions();
//   expect(actions[0].type).toEqual(sActions.challengeListing.sidebar.saveFilterInit.toString());
// });

//   test('selectBucket', () => {
//     filterPanel.prop('selectBucket')();
//     const actions = store.getActions();
//     expect(actions[0].type).toEqual(sActions.challengeListing.sidebar.selectBucket.toString());
//   });

//   test('selectCommunity', () => {
//     filterPanel.prop('selectCommunity')();
//     const actions = store.getActions();
//     expect(actions[0].type).toEqual(cActions.challengeListing.selectCommunity.toString());
//   });

//   test('setFilterState', () => {
//     filterPanel.prop('setFilterState')();
//     const actions = store.getActions();
//     expect(actions[0].type).toEqual(cActions.challengeListing.setFilter.toString());
//   });
// });
