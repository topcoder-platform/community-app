import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import { SearchBarInner } from 'components/Contentful/SearchBar/SearchBar';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  const MOCK_PROPS = {
    selected: '',
    options: [],
    theme: {},
  };
  renderer.render(<SearchBarInner {...MOCK_PROPS} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
