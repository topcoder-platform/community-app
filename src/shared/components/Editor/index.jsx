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

import {
  ContentState,
  convertFromHTML,
  EditorState,
  RichUtils,
} from 'draft-js';
import 'draft-js/dist/Draft.css';

import Editor from 'draft-js-plugins-editor';
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';

import { Connector } from './Toolbar';
import createCustomPlugin from './plugin';

import style from './style.scss';

const markdownPlugin = createMarkdownShortcutsPlugin();
const customPlugin = createCustomPlugin({
  noteStyle: style.note,
});

export default class EditorWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.id;
    this.state = {
      editorState: EditorState.createEmpty(),
      markdown: false,
    };
  }

  componentDidMount() {
    const { connector, initialContent } = this.props;
    connector.addEditor(this);
    if (initialContent) {
      let editorState = convertFromHTML(initialContent);
      editorState = ContentState.createFromBlockArray(
        editorState.contentBlocks,
        editorState.entityMap,
      );
      editorState = EditorState.createWithContent(editorState);
      setImmediate(() => this.setState({ editorState }));
    }
  }

  componentWillReceiveProps({ connector, id }) {
    const prevConnector = this.props.connector;
    this.id = id;
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
          plugins={[
            this.state.markdown ? markdownPlugin : {},
            customPlugin,
          ]}
          ref={(node) => { this.node = node; }}
          spellCheck
        />
      </div>
    );
  }
}

EditorWrapper.defaultProps = {
  connector: new Connector(),
  id: null,
  initialContent: null,
};

EditorWrapper.propTypes = {
  connector: PT.instanceOf(Connector),
  id: PT.string,
  initialContent: PT.string,
};
