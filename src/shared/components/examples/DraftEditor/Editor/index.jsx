/**
 * Main editor component.
 * It is largerly inspired by the example
 * https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/tex
 */

/* NOTE: According to docs https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md
  this error should not be triggered when element has proper value of the
  role attribute. However, AirBnB ESLint config uses legacy version of
  eslint-plugin-jsx-a11y, and it does not follow the docs. */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import _ from 'lodash';
import { Map } from 'immutable';
import PT from 'prop-types';
import React from 'react';
import {
  AtomicBlockUtils,
  Editor as DraftEditor,
  EditorState,
} from 'draft-js';

import TcBlock from '../TcBlock';

import './style.scss';

export default class Editor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editableTcBlocks: Map(),
      editorState: EditorState.createEmpty(),
    };
  }

  insertTcBlock() {
    let editorState = this.state.editorState;
    let content = editorState.getCurrentContent();
    content = content.createEntity(
      'TOKEN',
      'IMMUTABLE',
      { content: 'TEST' },
    );
    const key = content.getLastCreatedEntityKey();
    editorState = EditorState.set(
      editorState,
      { currentContent: content },
    );
    editorState = AtomicBlockUtils.insertAtomicBlock(editorState, key, '');
    this.setState({ editorState });
  }

  renderBlock(block) {
    if (block.getType() === 'atomic') {
      return {
        component: TcBlock,
        editable: false,
        props: {
          onFocused: () => {
            this.setState({
              editableTcBlocks:
                this.state.editableTcBlocks.set(block.getKey(), true),
            });
          },
          onBlured: () => this.setState({
            editableTcBlocks:
              this.state.editableTcBlocks.remove(block.getKey()),
          }),
        },
      };
    }
    return null;
  }

  render() {
    const { editorState } = this.state;
    return (
      <div
        onClick={(e) => {
          this.props.onFocused();
          e.stopPropagation();
        }}
        role="button"
        styleName="editor"
      >
        <div styleName="toolbar">
          <button
            onClick={() => {
              this.insertTcBlock();
            }}
          >
            test
          </button>
        </div>
        <div styleName="content">
          <DraftEditor
            blockRendererFn={block => this.renderBlock(block)}
            editorState={editorState}
            onChange={(newEditorState) => {
              const focused = newEditorState.getSelection().getHasFocus();
              if (!focused) this.props.onBlured();
              this.setState({
                editorState: newEditorState,
              });
            }}
            readOnly={this.state.editableTcBlocks.count()}
          />
        </div>
      </div>
    );
  }
}

Editor.defaultProps = {
  onBlured: _.noop,
  onFocused: _.noop,
};

Editor.propTypes = {
  onBlured: PT.func,
  onFocused: PT.func,
};
