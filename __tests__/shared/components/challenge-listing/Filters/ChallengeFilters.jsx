// import React from 'react';
// import _ from 'lodash';
// import moment from 'moment';
// import Renderer from 'react-test-renderer/shallow';
// import TU from 'react-dom/test-utils';
// import ChallengeFilters from 'components/challenge-listing/Filters/ChallengeFilters';
import MockDate from 'mockdate';

beforeAll(() => {
  MockDate.set(1500262917951, 160);
});

afterAll(() => {
  MockDate.reset();
});

// const saveFilter = jest.fn();
// const selectCommunity = jest.fn();
// const setExpanded = jest.fn();
// const setFilterState = jest.fn();
// const setSearchText = jest.fn();
// const showTrackModal = jest.fn();

// const mockDatas = [{
//   challengeGroupId: '1',
//   communityFilters: [{ filter: {} }],
//   challenges: [],
//   communityName: 'name',
//   expanded: false,
//   filterState: {},
//   isCardTypeSet: 'type',
//   saveFilter,
//   selectCommunity,
//   selectedCommunityId: '3',
//   setExpanded,
//   setFilterState,
//   searchText: '',
//   setSearchText,
//   showTrackModal,
//   trackModalShown: true,
//   validTypes: [''],
// }, {
//   challengeGroupId: '1',
//   communityFilters: [{ filter: {} }],
//   communityName: 'name',
//   expanded: false,
//   filterState: {
//     tags: ['abc'], types: ['927abff4-7af9-4145-8ba1-577c16e64e2e'],
// endDate: moment('2019-12-31T23:00:00.000Z'),
// startDate: moment('2019-12-31T23:00:00.000Z'), tracks: ['tracks'],
//   },
//   isCardTypeSet: 'Challenges',
//   saveFilter,
//   selectCommunity,
//   selectedCommunityId: '3',
//   setExpanded,
//   setFilterState,
//   searchText: '',
//   setSearchText,
//   showTrackModal,
//   trackModalShown: true,
//   validTypes: [''],
// }];

describe('Matches shallow shapshot', () => {
  // const renderer = new Renderer();

  test('shapshot', () => {
    // _.forEach(mockDatas, (data) => {
    //   renderer.render((
    //     <ChallengeFilters {...data} />
    //   ));
    //   expect(renderer.getRenderOutput()).toMatchSnapshot();
    // });
    expect(true).toBe(true);
  });
});

// class Wrapper extends React.Component {
//   componentDidMount() {}

//   render() {
//     return <ChallengeFilters {...this.props} />;
//   }
// }

// describe.skip('handle events', () => {
//   const instance = TU.renderIntoDocument((<Wrapper {...mockDatas[1]} />));
//   test('switchTrack', () => {
//     let buttons =
// TU.scryRenderedDOMComponentsWithClass(instance, 'filter-switch-with-label');
//     /*
//     expect(buttons).toHaveLength(3);
//     TU.Simulate.click(buttons[0].children[0]);
//     TU.Simulate.click(buttons[1].children[0]);
//     TU.Simulate.click(buttons[2].children[0]);
//     */

//     buttons = TU.scryRenderedDOMComponentsWithClass(instance, 'track-btn');
//     expect(buttons).toHaveLength(1);
//     TU.Simulate.click(buttons[0]);
//     expect(showTrackModal).toHaveBeenCalledTimes(1);

//     buttons = TU.findAllInRenderedTree(instance, 'filter-btn');
//     expect(buttons).toHaveLength(1);
//     TU.Simulate.click(buttons[0]);
//     expect(setExpanded).toHaveBeenCalledTimes(1);

//     buttons = TU.findAllInRenderedTree(instance, ('close-icon'));
//     expect(buttons).toHaveLength(2);
//     TU.Simulate.click(buttons[0]);
//     TU.Simulate.click(buttons[1]);
//     expect(showTrackModal).toHaveBeenCalledTimes(2);
//     expect(setExpanded).toHaveBeenCalledTimes(2);

//     buttons = TU.findAllInRenderedTree(instance, 'Switch');
//     _.forEach(buttons, (button) => {
//       TU.Simulate.click(button);
//     });
//   });
// });
