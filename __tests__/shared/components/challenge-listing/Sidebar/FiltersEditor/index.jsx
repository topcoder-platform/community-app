import React from 'react';
import _ from 'lodash';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import FiltersEditor from 'components/challenge-listing/Sidebar/FiltersEditor';

const changeFilterName = jest.fn();
const deleteSavedFilter = jest.fn();
const dragSavedFilterMove = jest.fn();
const dragSavedFilterStart = jest.fn();
const resetFilterName = jest.fn();
const setEditSavedFiltersMode = jest.fn();
const updateAllSavedFilters = jest.fn();
const updateSavedFilter = jest.fn();

const mockDatas = [
  {
    changeFilterName,
    deleteSavedFilter,
    dragState: {},
    dragSavedFilterMove,
    dragSavedFilterStart,
    resetFilterName,
    savedFilters: [{ id: '1', name: 'name' }],
    setEditSavedFiltersMode,
    updateAllSavedFilters,
    updateSavedFilter,
  },
];

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  _.forEach(mockDatas, (data) => {
    renderer.render((
      <FiltersEditor {...data} />
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return <FiltersEditor {...this.props} />;
  }
}

test('handle events', () => {
  const instance = TU.renderIntoDocument((<Wrapper {...mockDatas[0]} />));
  let matches = TU.findAllInRenderedTree(instance, item =>
    item && item.className && item.className.match('done-button'));
  expect(matches).toHaveLength(1);
  TU.Simulate.click(matches[0]);
  expect(setEditSavedFiltersMode).toHaveBeenCalledWith(false);

  matches = TU.scryRenderedDOMComponentsWithTag(instance, 'input');
  expect(matches).toHaveLength(1);
  TU.Simulate.change(matches[0], { target: { value: 'value' } });
  expect(changeFilterName).toHaveBeenCalledWith(0, 'value');
  expect(resetFilterName).not.toHaveBeenCalled();
  TU.Simulate.keyDown(matches[0], { key: 'Enter' });
  expect(resetFilterName).not.toHaveBeenCalled();
  TU.Simulate.keyDown(matches[0], { key: 'A' });
  expect(resetFilterName).not.toHaveBeenCalled();
  TU.Simulate.keyDown(matches[0], { key: 'Escape' });
  expect(resetFilterName).toHaveBeenCalledWith(0);
  TU.Simulate.blur(matches[0]);
  expect(updateSavedFilter).toHaveBeenCalled();

  matches = TU.findAllInRenderedTree(instance, item =>
    item && item.className && item.className.match('right'));
  expect(matches).toHaveLength(1);
  TU.Simulate.click(matches[0]);
  expect(deleteSavedFilter).toHaveBeenCalledWith('1');

  matches = TU.findAllInRenderedTree(instance, item =>
    item && item.className && item.className.match('ActiveFilterItem'));
  expect(dragSavedFilterMove).not.toHaveBeenCalled();
  TU.Simulate.drag(matches[0]);
  expect(dragSavedFilterMove).toHaveBeenCalled();
  expect(dragSavedFilterStart).not.toHaveBeenCalled();
  TU.Simulate.dragStart(matches[0]);
  expect(dragSavedFilterStart).toHaveBeenCalled();
});

