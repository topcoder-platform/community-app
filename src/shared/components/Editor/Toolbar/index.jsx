/**
 * <Toolbar> Component
 * Implements a Toolbar that can control multiple <Editor> components
 */
import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import Sticky from 'react-stickynode';

import { Button } from 'components/buttons';
import Select from 'components/Select';
// import Modal from 'components/Modal';
import { EDITOR_BLOCK_STYLE_MAP, EDITOR_COLOR_MAP } from 'utils/editor';

import {
  EditorState,
  Modifier,
  RichUtils,
} from 'draft-js';

import ColorPicker from './ColorPicker';
import Connector from '../Connector';

import style from './style.scss';

/**
 * Component class, provides a Toolbar that can control multiple Editor components
 * connected to it via the Connector class
 */
export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      block: null,
      editor: null,
      markdown: false,
      pickingTextColor: false,
      pickingHighlightColor: false,

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
      const block = RichUtils.getCurrentBlockType(newState);
      this.setState({
        editor,
        block,
        BOLD: inlineStyle.has('BOLD'),
        INLINE_CODE: inlineStyle.has('CODE'),
        ITALIC: inlineStyle.has('ITALIC'),
        UNDERLINE: inlineStyle.has('UNDERLINE'),
        STRIKETHROUGH: inlineStyle.has('STRIKETHROUGH'),
      });
    } else {
      this.setState({
        block: 'unstyled',
        editor: null,
        BOLD: false,
        INLINE_CODE: false,
        ITALIC: false,
        UNDERLINE: false,
        STRIKETHROUGH: false,
      });
    }
  }

  /**
   * Sets the block type at the current selection.  Type map can be found in utils/editor.
   * @param {String} newType The new block type
   */
  setBlockType(newType) {
    let editorState = this.state.editor ? this.state.editor.state.editorState : null;
    if (editorState) {
      editorState = RichUtils.toggleBlockType(editorState, newType);
      this.setState({ block: newType });
      this.state.editor.setState({ editorState });
    }
  }

  /**
   * Sets the color at the current selection for the specified category.
   * Type map can be found in utils/editor.
   * @param {String} type Category, TEXT or HIGHLIGHT
   * @param {String} color The new color name
   */
  setColorStyle(type, color) {
    const editor = this.state.editor;

    let editorState = editor ? editor.state.editorState : null;
    if (editorState) {
      let contentState = editorState.getCurrentContent();

      const sel = editorState.getSelection();

      // Clear any existing colors
      contentState = _.reduce(
        EDITOR_COLOR_MAP,
        (state, value, name) => Modifier.removeInlineStyle(state, sel, `${type}_${name}`),
        contentState);

      // Apply new color
      contentState = Modifier.applyInlineStyle(contentState, sel, `${type}_${color}`);

      editorState = EditorState.push(editorState, contentState, 'change-inline-style');
      editor.setState({ editorState });
    }
  }

  /**
   * Inserts a new link at current cursor selection.
   * @param {String} title Default title to display for the link, if no text is selected in range
   * @param {String} href The <a> href
   */
  insertLink(title, href) {
    const editor = this.state.editor;
    let editorState = editor ? editor.state.editorState : null;
    if (editorState) {
      let contentState = editorState.getCurrentContent();

      const sel = editorState.getSelection();

      contentState = contentState.createEntity('LINK', 'MUTABLE', { href, insertedFromToolbar: true });
      const key = contentState.getLastCreatedEntityKey();

      // Selection is a just the cursor, insert new link
      if (sel.isCollapsed()) {
        // Inserts a space at the cursor, needed so that the user can 'escape'
        // from the link entity by clicking after the link, or pressing right arrow
        contentState = Modifier.insertText(
          contentState,
          sel,
          ' ',
          null,
          null,
        );
        // Because selection hasn't been updated, this will insert the link *before*
        // the newly created space.
        contentState = Modifier.insertText(
          contentState,
          sel,
          title,
          null,
          key,
        );

        editorState = EditorState.push(editorState, contentState, 'insert-characters');
      } else { // Selection is a range, keep the text but make it a link
        editorState = RichUtils.toggleLink(editorState, sel, key);
      }

      editor.setState({ editorState });
    }
  }

  /**
   * Toggle an inline text style
   * @param {String} styleName Name of the style
   */
  toggleInlineStyle(styleName) {
    const editor = this.state.editor;
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
    const disableStyling = !st.editor;

    const createStyleButton = (label, name, active, theme) => (
      <Button
        active={active}
        disabled={disableStyling}
        onMouseDown={(e) => {
          e.preventDefault();
          this.toggleInlineStyle(name);
        }}
        size="sm"
        theme={{ button: theme }}
      >{label}</Button>
    );

    return (
      <Sticky innerZ={2}>
        <div styleName="container">

          <Button
            onClick={() => this.props.onSave()}
            size="sm"
            theme={{ button: style.basic }}
          >Save</Button>
          <div styleName="separator" />

          <Button
            active={this.state.markdown}
            onMouseDown={(e) => {
              e.preventDefault();
              const active = !this.state.markdown;
              this.setState({ markdown: active });
              this.props.connector.toggleInlineMarkdown(active);
            }}
            size="sm"
            theme={{ button: style.basic }}
          >Inline Markdown</Button>

          <div styleName="separator" />

          { createStyleButton('B', 'BOLD', st.BOLD, style.bold) }
          { createStyleButton('I', 'ITALIC', st.ITALIC, style.italic) }
          { createStyleButton('U', 'UNDERLINE', st.UNDERLINE, style.underline) }
          { createStyleButton('S', 'STRIKETHROUGH', st.STRIKETHROUGH, style.strikethrough) }
          { createStyleButton('Monospace', 'CODE', st.CODE, style.inlineCode) }

          <div styleName="separator" />

          <Button
            disabled={disableStyling}
            onMouseDown={(e) => {
              e.preventDefault();
              this.setState({ pickingTextColor: !this.state.pickingTextColor });
            }}
            size="sm"
            theme={{ button: style.basic }}
          >Color</Button>
          <ColorPicker
            onChange={(color) => {
              const editor = this.state.editor || this.props.connector.previousEditor;
              editor.node.focus();
              setImmediate(() => {
                this.setColorStyle('TEXT', color);
                this.setState({ pickingTextColor: false });
              });
            }}
            style={style['text-color-picker']}
            visible={this.state.pickingTextColor}
          />

          <Button
            disabled={disableStyling}
            onMouseDown={(e) => {
              e.preventDefault();
              this.setState({ pickingHighlightColor: !this.state.pickingHighlightColor });
            }}
            size="sm"
            theme={{ button: style.basic }}
          >Highlight</Button>
          <ColorPicker
            onChange={(color) => {
              const editor = this.state.editor || this.props.connector.previousEditor;
              editor.node.focus();
              setImmediate(() => {
                this.setColorStyle('HIGHLIGHT', color);
                this.setState({ pickingHighlightColor: false });
              });
            }}
            style={style['highlight-color-picker']}
            visible={this.state.pickingHighlightColor}
          />

          <div styleName="separator" />

          <Button
            disabled={disableStyling}
            onMouseDown={(e) => {
              e.preventDefault();
              this.insertLink('New Link', 'http://');
            }}
            size="sm"
            theme={{ button: style.basic }}
          >Insert Link</Button>

          <Button
            disabled={disableStyling}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            size="sm"
            theme={{ button: style.basic }}
          >Insert Image</Button>

          <div styleName="select-wrapper">
            <Select
              autoBlur
              clearable={false}
              className={style.select}
              disabled={disableStyling}
              onChange={option => this.setBlockType(option.value)}
              onFocus={e => e.preventDefault()}
              options={_.map(EDITOR_BLOCK_STYLE_MAP, (label, value) => ({ label, value }))}
              placeholder="Block Style"
              value={st.editor ? st.block : null}
            />

          </div>
        </div>
      </Sticky>
    );
  }
}

Toolbar.defaultProps = {
  connector: new Connector(),
  onSave: _.noop,
};

Toolbar.propTypes = {
  connector: PT.instanceOf(Connector),
  onSave: PT.func,
};
