import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import { FilterRadioInner } from 'components/Contentful/SearchPageFilter/FilterRadio';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  const MOCK_PROPS = {
    theme: {},
  };
  renderer.render(<FilterRadioInner {...MOCK_PROPS} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
