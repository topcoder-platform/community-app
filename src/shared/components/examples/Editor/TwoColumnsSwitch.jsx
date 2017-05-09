import PT from 'prop-types';
import React from 'react';
import { EditorState, Modifier, RichUtils } from 'draft-js';

export default function TwoColumnsSwitch({
  editorState,
  onChange,
}) {
  return (
    <button
      onClick={() => {
        const newContentState = Modifier.insertText(
          editorState.getCurrentContent(),
          editorState.getSelection(),
          '%%COLUMN-SEPARATOR%%',
        );
        let newEditorState = EditorState.set(editorState, {
          currentContent: newContentState,
        });
        newEditorState = RichUtils.toggleBlockType(
          newEditorState,
          'two-columns',
        );
        onChange(newEditorState);
      }}
    >
      Make Two Columns
    </button>
  );
}

TwoColumnsSwitch.propTypes = {
  editorState: PT.shape({}).isRequired,
  onChange: PT.func.isRequired,
};
