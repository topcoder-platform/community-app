import _ from 'lodash';
import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import Search from 'components/TopcoderHeader/mobile/Search';
import TU from 'react-dom/test-utils';

class SearchWrapper extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <Search {...this.props} />
    );
  }
}

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render(<Search />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

const page = TU.renderIntoDocument(<SearchWrapper />);

test.skip('Handles Enter key', () => {
  const items = TU.scryRenderedDOMComponentsWithClass(page, 'search');
  const input = _.find(items[0].children, item => item && item.tagName === 'INPUT');
  TU.Simulate.keyPress(input, {
    key: 'Enter',
    target: {
      value: 'SEARCH',
    },
  });
  /* TODO: We want to check here that /search/members?q=SEARCH
   * was put into window.location, but inside jest test window.location
   * comes from jsdom, and it is not really changed (at least,
   * checking window.location returns a weird data structure,
   * what is the way to access set url is not that clear).
   * Should be investigated. */
});
