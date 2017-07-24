import React from 'react';
import _ from 'lodash';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';

const selectBucket = jest.fn();
const selectSavedFilter = jest.fn();
const setEditSavedFiltersMode = jest.fn();

const mockDatas = [
  {
    activeBucket: 'ALL',
    activeSavedFilter: 1,
    buckets: {
      ALL: { name: 'name', filter: {} },
      SAVED_FILTER: { name: 'name', filter: {} },
      OPEN_FOR_REGISTRATION: { name: 'name', filter: {} },
      PAST: { name: 'name', filter: {} },
      ONGOING: { name: 'name', filter: {} },
      MY: { name: 'name', filter: {} },
      UPCOMING: { name: 'name', filter: {} },
    },
    challenges: [{ id: '1', registrationOpen: 'open' }],
    communityFilter: {},
    disabled: false,
    filterState: {},
    isAuth: true,
    savedFilters: [],
    selectBucket,
    selectSavedFilter,
    setEditSavedFiltersMode,
  }, {
    activeBucket: 'SAVED_FILTER',
    activeSavedFilter: 0,
    buckets: {
      ALL: { name: 'name', filter: {} },
      SAVED_FILTER: { name: 'name', filter: {} },
      OPEN_FOR_REGISTRATION: { name: 'name', filter: {} },
      PAST: { name: 'name', filter: {} },
      ONGOING: { name: 'name', filter: {} },
      MY: { name: 'name', filter: {} },
      UPCOMING: { name: 'name', filter: {} },
    },
    challenges: [{ id: '1', registrationOpen: 'open' }],
    disabled: true,
    filterState: {},
    isAuth: false,
    savedFilters: [{ id: '1', name: 'name' }],
    selectBucket,
    selectSavedFilter,
    setEditSavedFiltersMode,
  },
];

jest.mock('utils/challenge-listing/buckets', () => ({
  BUCKETS: {
    ALL: 'ALL',
    SAVED_FILTER: 'SAVED_FILTER',
    OPEN_FOR_REGISTRATION: 'OPEN_FOR_REGISTRATION',
    PAST: 'PAST',
    ONGOING: 'ONGOING',
    MY: 'MY',
    UPCOMING: 'UPCOMING',
  },
}),
);

const BucketSelector = require('components/challenge-listing/Sidebar/BucketSelector').default;

class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return <BucketSelector {...this.props} />;
  }
}

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  _.forEach(mockDatas, (data) => {
    renderer.render((
      <BucketSelector {...data} />
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

test('handle clicks', () => {
  const instance = TU.renderIntoDocument((<Wrapper {...mockDatas[1]} disabled={false} activeBucket={'OPEN_FOR_REGISTRATION'} />));
  let matches = TU.findAllInRenderedTree(instance, item =>
    item && item.className && item.className.match('edit-link'));
  expect(matches).toHaveLength(1);
  TU.Simulate.click(matches[0]);
  expect(setEditSavedFiltersMode).toHaveBeenCalledWith(true);

  matches = TU.findAllInRenderedTree(instance, item =>
    item && item.className && item.className.match('bucket'));
  _.forEach(matches, match => TU.Simulate.click(match));
  expect(selectSavedFilter).toHaveBeenCalledWith(0);
  expect(selectBucket).toHaveBeenCalled();
});

