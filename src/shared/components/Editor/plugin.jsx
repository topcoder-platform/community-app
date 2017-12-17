/**
 * Custom DraftJS plugin.
 *
 * Facilitates the extra functionality required for <Editor> component.
 * Including: Images, Links, and the Note block.
 *
 * In the future, it should also be possible to validate allowed block elements here,
 * and also substitute them for the nearest available option when HTML is rendered.
 */
import _ from 'lodash';
import React from 'react';
import { Map } from 'immutable';
import { EDITOR_COLOR_MAP } from 'utils/editor';

import Link from './Link';

// This is based on the strategy that draft-js-markdown-shortcuts-plugin uses
// so it will work on images and links created with markdown
const createStrategy = type =>
  (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((metadata) => {
      const key = metadata.getEntity();
      return key !== null && contentState.getEntity(key).getType() === type;
    }, callback);
  };

export default ({ noteStyle }) => {
  const inlineStyles = {};

  _.forIn(EDITOR_COLOR_MAP, (value, name) => {
    inlineStyles[`TEXT_${name}`] = { color: value };
    inlineStyles[`HIGHLIGHT_${name}`] = { background: value };
  });

  return ({
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
    blockStyleFn: block => (block.getType() === 'note' ? noteStyle : null),
    // Provides custom styling for inline elements (mainly text)
    customStyleMap: {
      CODE: {
        background: '#fafafb',
        fontFamily: '"Roboto Mono", monospace',
      },
      ...inlineStyles,
    },
    // Provides custom component rendering for images and links
    decorators: [
      {
        strategy: createStrategy('LINK'),
        component: Link,
      },
    ],
  });
};
