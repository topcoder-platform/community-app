/**
 * Custom DraftJS plugin.
 *
 * Facilitates the extra functionality required for <Editor> component.
 * Including: Images, Links, and the Note block.
 *
 * In the future, it should also be possible to validate allowed block elements here,
 * and also substitute them for the nearest available option when HTML is rendered.
 */
import React from 'react';
import { Map } from 'immutable';

export default ({ noteStyle }) => ({
  // Provides custom html element rendering for block types
  blockRenderMap: Map({
    // draft-js and draft-js-markdown-shortcuts-plugin use inconsistent rendering of
    // code-blocks, so we override both of them
    'code-block': {
      element: 'code',
      wrapper: <pre />,
    },
  }),
  // Provides custom styling for block types
  blockStyleFn: (block) => {
    const type = block.getType();

    if (type === 'note') {
      return noteStyle;
    }

    return null;
  },
  // Provides custom styling for inline elements (mainly text)
  customStyleMap: {
    CODE: {
      background: '#fafafb',
      fontFamily: '"Roboto Mono", monospace',
    },
  },
});
