import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import FiltersCardsType from 'components/challenge-listing/Filters/FiltersCardsType';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <FiltersCardsType isCardTypeSet />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <FiltersCardsType isCardTypeSet={false} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return <FiltersCardsType {...this.props} />;
  }
}

test('handle events', () => {
  const instance = TU.renderIntoDocument((<Wrapper />));
  const matches = TU.scryRenderedDOMComponentsWithTag(instance, 'a');
  expect(matches).toHaveLength(2);
  TU.Simulate.click(matches[0]);
});
