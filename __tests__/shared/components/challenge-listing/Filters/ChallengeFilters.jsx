import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import ChallengeFilters from 'components/challenge-listing/Filters/ChallengeFilters';
import MockDate from 'mockdate';

beforeAll(() => {
  MockDate.set(1500262917951, 160);
});

afterAll(() => {
  MockDate.reset();
});

const saveFilter = jest.fn();
const selectCommunity = jest.fn();
const setCardType = jest.fn();
const setExpanded = jest.fn();
const setFilterState = jest.fn();
const setSearchText = jest.fn();
const showTrackModal = jest.fn();

const mockDatas = [{
  challengeGroupId: '1',
  communityFilters: [{ filter: {} }],
  communityName: 'name',
  expanded: false,
  filterState: {},
  isCardTypeSet: 'type',
  saveFilter,
  selectCommunity,
  selectedCommunityId: '3',
  setCardType,
  setExpanded,
  setFilterState,
  searchText: '',
  setSearchText,
  showTrackModal,
  trackModalShown: true,
  validKeywords: [''],
  validSubtracks: [''],
}, {
  challengeGroupId: '1',
  communityFilters: [{ filter: {} }],
  communityName: 'name',
  expanded: false,
  filterState: { tags: ['abc'], subtracks: ['CODE'], endDate: moment('2019-12-31T23:00:00.000Z'), startDate: moment('2019-12-31T23:00:00.000Z'), tracks: ['tracks'] },
  isCardTypeSet: 'Challenges',
  saveFilter,
  selectCommunity,
  selectedCommunityId: '3',
  setCardType,
  setExpanded,
  setFilterState,
  searchText: '',
  setSearchText,
  showTrackModal,
  trackModalShown: true,
  validKeywords: [''],
  validSubtracks: [''],
}];

describe('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  test('shapshot', () => {
    _.forEach(mockDatas, (data) => {
      renderer.render((
        <ChallengeFilters {...data} />
      ));
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});

class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return <ChallengeFilters {...this.props} />;
  }
}

describe('handle events', () => {
  const instance = TU.renderIntoDocument((<Wrapper {...mockDatas[1]} />));
  test('switchTrack', () => {
    let buttons = TU.findAllInRenderedTree(instance, item =>
      item && item.className && item.className.match('filter-switch-with-label'));
    expect(buttons).toHaveLength(3);
    TU.Simulate.click(buttons[0].children[0]);
    TU.Simulate.click(buttons[1].children[0]);
    TU.Simulate.click(buttons[2].children[0]);

    buttons = TU.findAllInRenderedTree(instance, item =>
      item && item.className && item.className.match('track-btn'));
    expect(buttons).toHaveLength(1);
    TU.Simulate.click(buttons[0]);
    expect(showTrackModal).toHaveBeenCalledTimes(1);

    buttons = TU.findAllInRenderedTree(instance, item =>
      item && item.className && item.className.match('filter-btn'));
    expect(buttons).toHaveLength(1);
    TU.Simulate.click(buttons[0]);
    expect(setExpanded).toHaveBeenCalledTimes(1);

    buttons = TU.findAllInRenderedTree(instance, item =>
      item && item.className && item.className.match('close-icon'));
    expect(buttons).toHaveLength(2);
    TU.Simulate.click(buttons[0]);
    TU.Simulate.click(buttons[1]);
    expect(showTrackModal).toHaveBeenCalledTimes(2);
    expect(setExpanded).toHaveBeenCalledTimes(2);

    buttons = TU.findAllInRenderedTree(instance, item =>
      item && item.className && item.className.match('Switch') && item.className.match('Switch'));
    _.forEach(buttons, (button) => {
      TU.Simulate.click(button);
    });
  });
});
