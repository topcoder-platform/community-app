import PT from 'prop-types';
import React from 'react';
import { EditorState, Modifier } from 'draft-js';

export default function CustomButton({
  editorState,
  onChange,
}) {
  return (
    <button
      onClick={() => {
        const newContentState = Modifier.replaceText(
          editorState.getCurrentContent(),
          editorState.getSelection(),
          'Button Clicked!',
        );
        const newEditorState = EditorState.set(editorState, {
          currentContent: newContentState,
        });
        onChange(newEditorState);
      }}
    >
      Custom Button (Inserts `Button Clicked!` text)
    </button>
  );
}

CustomButton.propTypes = {
  editorState: PT.shape({}).isRequired,
  onChange: PT.func.isRequired,
};
