/**
 * General-purpose wrapper around DraftJS editor.
 */

import PT from 'prop-types';
import React from 'react';

import { Editor, EditorState } from 'draft-js';

import 'draft-js/dist/Draft.css';
import style from './style.scss';

export default class GenericEditor extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.id;
    this.state = { editor: EditorState.createEmpty(props.decorator) };
  }

  focus() {
    if (this.editor) this.editor.focus();
  }

  render() {
    const {
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
  decorator: null,
  id: '',
  onChange: null,
};

GenericEditor.propTypes = {
  decorator: PT.shape(),
  id: PT.string,
  onChange: PT.func,
};
