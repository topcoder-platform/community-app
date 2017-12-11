import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import Sticky from 'react-stickynode';

import { Button } from 'components/buttons';
import { RichUtils } from 'draft-js';

import style from './style.scss';

/**
 * Auxiliary class that helps to connect Toolbar to multiple Editor instances.
 */
export class Connector {
  constructor() {
    this.editors = [];
    this.focusedEditor = null;
    this.toolbar = null;
  }

  /**
   * Adds a new Editor instance.
   * @param {Editor} editor
   */
  addEditor(editor) {
    this.editors.push(editor);
  }

  setFocusedEditor(editor, newState) {
    this.focusedEditor = editor;
    if (this.toolbar) this.toolbar.onFocusedEditorChanged(newState);
  }

  /**
   * Sets the Toolbar.
   * @param {Toolbar} toolbar
   */
  setToolbar(toolbar) {
    this.toolbar = toolbar;
  }

  /**
   * Removes the editor.
   * @param {Editor} editor
   */
  removeEditor(editor) {
    _.pull(this.editor, editor);
  }
}

export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      BOLD: false,
      ITALIC: false,
    };
  }

  componentDidMount() {
    this.props.connector.setToolbar(this);
  }

  componentWillReceiveProps({ connector }) {
    const prevConnector = this.props.connector;
    if (connector !== prevConnector) {
      if (prevConnector) prevConnector.setToolbar(null);
      if (connector) connector.setToolbar(this);
    }
  }

  componentWillUnmount() {
    this.props.connector.setToolbar(null);
  }

  onFocusedEditorChanged(newState) {
    const editor = this.props.connector.focusedEditor;
    if (editor) {
      const inlineStyle = newState.getCurrentInlineStyle();
      this.setState({
        BOLD: inlineStyle.has('BOLD'),
        INLINE_CODE: inlineStyle.has('CODE'),
        ITALIC: inlineStyle.has('ITALIC'),
        UNDERLINE: inlineStyle.has('UNDERLINE'),
        STRIKETHROUGH: inlineStyle.has('STRIKETHROUGH'),
      });
    } else {
      this.setState({
        BOLD: false,
        INLINE_CODE: false,
        ITALIC: false,
        UNDERLINE: false,
        STRIKETHROUGH: false,
      });
    }
  }

  toggleInlineStyle(styleName) {
    const editor = this.props.connector.focusedEditor;
    if (editor) {
      const editorState = RichUtils.toggleInlineStyle(
        editor.state.editorState, styleName);
      const inlineStyle = editorState.getCurrentInlineStyle();
      this.setState({ [styleName]: inlineStyle.has(styleName) });
      editor.setState({ editorState });
    }
  }

  render() {
    const st = this.state;
    return (
      <Sticky innerZ={2}>
        <div styleName="container">
          <Button
            active={st.BOLD}
            onMouseDown={(e) => {
              e.preventDefault();
              this.toggleInlineStyle('BOLD');
            }}
            size="sm"
            theme={{ button: style.bold }}
          >B</Button>
          <Button
            active={st.ITALIC}
            onMouseDown={(e) => {
              e.preventDefault();
              this.toggleInlineStyle('ITALIC');
            }}
            size="sm"
            theme={{ button: style.italic }}
          >I</Button>
          <Button
            active={st.UNDERLINE}
            onMouseDown={(e) => {
              e.preventDefault();
              this.toggleInlineStyle('UNDERLINE');
            }}
            size="sm"
            theme={{ button: style.underline }}
          >U</Button>
          <Button
            active={st.STRIKETHROUGH}
            onMouseDown={(e) => {
              e.preventDefault();
              this.toggleInlineStyle('STRIKETHROUGH');
            }}
            size="sm"
            theme={{ button: style.strikethrough }}
          >S</Button>
          <Button
            active={st.INLINE_CODE}
            onMouseDown={(e) => {
              e.preventDefault();
              this.toggleInlineStyle('CODE');
            }}
            size="sm"
            theme={{ button: style.inlineCode }}
          >Monospace</Button>
        </div>
      </Sticky>
    );
  }
}

Toolbar.defaultProps = {
  connector: new Connector(),
};

Toolbar.propTypes = {
  connector: PT.instanceOf(Connector),
};
