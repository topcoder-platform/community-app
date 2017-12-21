/**
 * Markdown editor.
 */

import Prism from 'prismjs';
import PT from 'prop-types';
import PrismDecorator from 'draft-js-prism';
import React from 'react';

import { EditorState } from 'draft-js';
import { stateFromMarkdown } from 'draft-js-import-markdown';

import 'prismjs/components/prism-markdown';
import 'prismjs/themes/prism.css';

import GenericEditor from '../GenericEditor';

export default function MarkdownEditor({ connector }) {
  const decorator = new PrismDecorator({
    defaultSyntax: 'markdown',
    filter: () => true,
    prism: Prism,
  });

  const updateMonitor = (newState) => {
    if (!connector || !connector.markdownMonitor) return;

    let newContent = newState.getCurrentContent();
    newContent = stateFromMarkdown(newContent.getPlainText());

    setImmediate(() =>
      connector.markdownMonitor.setState({
        editor: EditorState.createWithContent(newContent),
      }),
    );
  };

  return (
    <GenericEditor
      decorator={decorator}
      onChange={updateMonitor}
    />
  );
}

MarkdownEditor.defaultProps = {
  connector: null,
};

MarkdownEditor.propTypes = {
  connector: PT.shape(),
};
