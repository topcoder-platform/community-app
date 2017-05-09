/**
 * POC page editor, assembled directly from DraftJS.
 */

// import draftToHtml from 'draftjs-to-html';
import React from 'react';
import Editor from './Editor';

// import { convertToRaw, Editor, EditorState, RichUtils } from 'draft-js';
import './style.scss';

export default function DraftEditor() {
  return (
    <Editor />
  );
}

/*
export default class DraftEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
  }

  onChange(editorState) {
    this.setState({ editorState });
  }

  render() {
    const { editorState } = this.state;
    const content = editorState.getCurrentContent();
    const render = draftToHtml(convertToRaw(content));
    return (
      <div styleName="page">
        <h1>Draft Editor POC</h1>
        <h3>Editor</h3>
        <div styleName="toolbar">
          <button
            onClick={() => {
              const newEditorState = RichUtils.toggleInlineStyle(
                editorState, 'BOLD');
              this.setState({
                editorState: newEditorState,
              });
            }}
          >Bold</button>
          <button
            onClick={() => {
              const newEditorState = RichUtils.toggleInlineStyle(
                editorState, 'ITALIC');
              this.setState({
                editorState: newEditorState,
              });
            }}
          >Italic</button>
          <button
            onClick={() => {
              const newEditorState = RichUtils.toggleBlockType(
                editorState,
                'tc-block',
              );
              this.setState({
                editorState: newEditorState,
              });
            }}
          >
            TC Block
          </button>
        </div>
        <div styleName="editor">
          <Editor
            editorState={editorState}
            onChange={state => this.onChange(state)}
            blockRendererFn={renderer}
          />
        </div>
        <h3>Page HTML</h3>
        <div styleName="render">
          {JSON.stringify(render)}
        </div>
      </div>
    );
  }
}*/
