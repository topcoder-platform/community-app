/**
 * General-purpose DraftJS editor, wrapped in an auxiliary component.
 */

import PT from 'prop-types';
import React from 'react';

import { DefaultDraftBlockRenderMap, Editor, EditorState } from 'draft-js';

import 'draft-js/dist/Draft.css';

import Connector from '../Connector';
import style from './style.scss';

export default class GenericEditor extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.id;
    this.state = { editor: EditorState.createEmpty(props.decorator) };
  }

  componentDidMount() {
    const { connector } = this.props;
    if (connector) connector.addEditor(this);
  }

  componentWillReceiveProps({ connector, id }) {
    const { connector: prevConnector } = this.props;
    this.id = id;
    if (connector !== prevConnector) {
      if (prevConnector) prevConnector.removeEditor(this);
      if (connector) connector.addEditor(this);
    }
  }

  componentWillUnmount() {
    const { connector } = this.props;
    if (connector) connector.removeEditor(this);
  }

  focus() {
    if (this.editor) this.editor.focus();
  }

  render() {
    const {
      blockRendererFn,
      blockRenderMap,
      blockStyleFn,
      connector,
      editorState,
      onChange,
    } = this.props;
    const {
      editor,
    } = this.state;

    let containerStyles = style.container;
    if (editor.getSelection().getHasFocus()) {
      containerStyles += ` ${style.focused}`;
    }

    return (
      <div
        className={containerStyles}
        onClick={() => this.focus()}
        onKeyPress={() => this.focus()}
        onFocus={() => this.focus()}
        role="button"
        tabIndex={0}
      >
        <Editor
          blockRendererFn={blockRendererFn}
          blockRenderMap={DefaultDraftBlockRenderMap.merge(blockRenderMap)}
          blockStyleFn={blockStyleFn}
          editorState={editorState || editor}
          onChange={(state) => {
            if (connector) connector.setFocusedEditor(this, state);
            if (onChange) onChange(state);
            else this.setState({ editor: state });
          }}
          ref={(node) => { this.editor = node; }}
        />
      </div>
    );
  }
}

GenericEditor.defaultProps = {
  blockRendererFn: () => null,
  blockRenderMap: null,
  blockStyleFn: () => null,
  connector: null,
  decorator: null,
  editorState: null,
  id: '',
  onChange: null,
};

GenericEditor.propTypes = {
  blockRendererFn: PT.func,
  blockRenderMap: PT.shape(),
  blockStyleFn: PT.func,
  connector: PT.instanceOf(Connector),
  id: PT.string,

  /* If you want to use GenericEditor as a controlled component, pass in its
   * current state and the onChange callback. Otherwise a local editor state
   * will be used automatically. */
  editorState: PT.instanceOf(EditorState),
  onChange: PT.func,

  /* The following props have the effect only when GenericEditor is not a
   * controlled component (otherwise you should apply them to your EditorState
   * as you need (before passing it in as a prop). */
  decorator: PT.shape(),
};
