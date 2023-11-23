import actions from 'actions/challenge-listing/filter-panel';
import defaultReducer from 'reducers/challenge-listing/filter-panel';


function testReducer(reducer) {
  let state;

  test('creates expected initial state', () => {
    state = reducer(undefined, {});
    expect(state).toEqual({
      expanded: false,
      searchSkills: [],
      searchText: '',
      trackModalShown: false,
    });
  });

  test('properly handles setExpanded', () => {
    state = reducer(state, actions.challengeListing.filterPanel.setExpanded(true));
    expect(state).toEqual({
      expanded: true,
      searchSkills: [],
      searchText: '',
      trackModalShown: false,
    });
  });

  test('properly handles setSearchText', () => {
    state = reducer(state, actions.challengeListing.filterPanel.setSearchText('test'));
    expect(state).toEqual({
      expanded: true,
      searchSkills: [],
      searchText: 'test',
      trackModalShown: false,
    });
  });

  test('properly handles showTrackModal', () => {
    state = reducer(state, actions.challengeListing.filterPanel.showTrackModal(true));
    expect(state).toEqual({
      expanded: true,
      searchSkills: [],
      searchText: 'test',
      trackModalShown: true,
    });
  });
}

describe('default reducer', () => testReducer(defaultReducer));
