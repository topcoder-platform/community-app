/**
 * General-purpose wrapper around DraftJS editor.
 */

import PT from 'prop-types';
import React from 'react';

import { ContentState, DefaultDraftBlockRenderMap, Editor, EditorState, convertFromHTML } from 'draft-js';

import 'draft-js/dist/Draft.css';
import style from './style.scss';

export default class GenericEditor extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.id;
/*
    let a = convertFromHTML('<ul><li><blockquote><p>wedwedw</p></blockquote><p>wedwedwed</p></li></ul>');
    a = ContentState.createFromBlockArray(a.contentBlocks, a.entityMap);
    */

    this.state = { editor: EditorState.createEmpty(props.decorator) };
//    this.state = { editor: EditorState.createWithContent(a) };
  }

  setEditorState(state) {
    setImmediate(() => this.setState({ editor: state }));
  }

  focus() {
    if (this.editor) this.editor.focus();
  }

  render() {
    const {
      blockRendererFn,
      blockRenderMap,
      blockStyleFn,
      onChange,
    } = this.props;

    let containerStyles = style.container;
    if (this.state.editor.getSelection().getHasFocus()) {
      containerStyles += ` ${style.focused}`;
    }

    return (
      <div
        className={containerStyles}
        onClick={() => this.focus()}
        onFocus={() => this.focus()}
        role="button"
        tabIndex={0}
      >
        <Editor
          blockRendererFn={blockRendererFn}
          blockRenderMap={DefaultDraftBlockRenderMap.merge(blockRenderMap)}
          blockStyleFn={blockStyleFn}
          editorState={this.state.editor}
          onChange={(newState) => {
            this.setState({ editor: newState });
            if (onChange) onChange(newState);
          }}
          ref={(node) => { this.editor = node; }}
          spellCheck
        />
      </div>
    );
  }
}

GenericEditor.defaultProps = {
  blockRendererFn: () => null,
  blockRenderMap: null,
  blockStyleFn: () => null,
  decorator: null,
  id: '',
  onChange: null,
};

GenericEditor.propTypes = {
  blockRendererFn: PT.func,
  blockRenderMap: PT.shape(),
  blockStyleFn: PT.func,
  decorator: PT.shape(),
  id: PT.string,
  onChange: PT.func,
};
