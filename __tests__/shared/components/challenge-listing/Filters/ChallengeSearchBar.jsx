import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import ChallengeSearchBar from 'components/challenge-listing/Filters/ChallengeSearchBar';

const onSearch = jest.fn();
const setQuery = jest.fn();

const mockData = {
  onSearch,
  query: 'query',
  setQuery,
};

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <ChallengeSearchBar {...mockData} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <ChallengeSearchBar {...mockData} query="" />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return <ChallengeSearchBar {...this.props} />;
  }
}

test('handle events', () => {
  const instance = TU.renderIntoDocument((<Wrapper {...mockData} />));
  let matches = TU.scryRenderedDOMComponentsWithTag(instance, 'input');
  expect(matches).toHaveLength(1);
  TU.Simulate.keyPress(matches[0], { key: 'Enter' });
  expect(onSearch).toHaveBeenCalledTimes(1);
  TU.Simulate.keyPress(matches[0], { key: 'A' });
  expect(onSearch).toHaveBeenCalledTimes(1);
  TU.Simulate.change(matches[0], { target: { value: 'abc' } });
  expect(setQuery).toHaveBeenCalledTimes(1);
  matches = TU.findAllInRenderedTree(instance, item =>
    item && item.className && item.className.match('SearchButton'));
  expect(matches).toHaveLength(1);
  TU.Simulate.click(matches[0]);
  expect(onSearch).toHaveBeenCalledTimes(2);
});
