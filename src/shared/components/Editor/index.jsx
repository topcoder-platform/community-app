/**
 * Content editor based on DraftJS.
 *
 * DraftJS is not Redux-friendly, thus our editor uses local state, unlike most
 * of our code. Technically, it is possible to keep its state in Redux store,
 * but it will have performance drawback, as it will demand constant conversions
 * between the Redux state segment and the internal state of the editor.
 */

import PT from 'prop-types';
import React from 'react';

import { Editor, EditorState, RichUtils } from 'draft-js';

import 'draft-js/dist/Draft.css';

import { Connector } from './Toolbar';

import style from './style.scss';

const INLINE_STYLE_MAP = {
  CODE: {
    background: '#fafafb',
    fontFamily: '"Roboto Mono", monospace',
  },
};

export default class EditorWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  componentDidMount() {
    this.props.connector.addEditor(this);
  }

  componentWillReceiveProps({ connector }) {
    const prevConnector = this.props.connector;
    if (connector !== prevConnector) {
      if (prevConnector) prevConnector.removeEditor(this);
      if (connector) connector.addEditor(this);
    }
  }

  componentWillUnmount() {
    this.props.connector.removeEditor(this);
  }

  focus() {
    if (this.node) this.node.focus();
  }

  render() {
    const { connector } = this.props;

    const st = this.state;

    let containerStyles = style.container;
    if (st.editorState.getSelection().getHasFocus()) {
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
          customStyleMap={INLINE_STYLE_MAP}
          editorState={st.editorState}
          handleKeyCommand={(command, state) => {
            const editorState = RichUtils.handleKeyCommand(
              state, command);
            if (editorState) {
              connector.setFocusedEditor(this, editorState);
              this.setState({ editorState });
              return true;
            }
            return false;
          }}
          onChange={(newState) => {
            const hasFocus = newState.getSelection().getHasFocus();
            connector.setFocusedEditor(hasFocus ? this : null, newState);
            this.setState({ editorState: newState });
          }}
          ref={(node) => { this.node = node; }}
          spellCheck
        />
      </div>
    );
  }
}

EditorWrapper.defaultProps = {
  connector: new Connector(),
};

EditorWrapper.propTypes = {
  connector: PT.instanceOf(Connector),
};
