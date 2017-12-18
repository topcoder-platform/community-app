/**
 * Content editor based on DraftJS.
 *
 * DraftJS is not Redux-friendly, thus our editor uses local state, unlike most
 * of our code. Technically, it is possible to keep its state in Redux store,
 * but it will have performance drawback, as it will demand constant conversions
 * between the Redux state segment and the internal state of the editor.
 */
import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';

import {
  ContentState,
  convertFromHTML,
  EditorState,
  Modifier,
  RichUtils,
} from 'draft-js';
import 'draft-js/dist/Draft.css';

import Editor from 'draft-js-plugins-editor';
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';

import { EDITOR_COLOR_MAP } from 'utils/editor';

import Connector from './Connector';
import createCustomPlugin from './plugin';

import style from './style.scss';

export default class EditorWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.id;

    this.state = {
      editorState: EditorState.createEmpty(),
      markdown: false,
    };

    // Each Editor needs its own instance of plugins
    this.markdownPlugin = createMarkdownShortcutsPlugin();
    // We need to inject the EditorWrapper into the plugin so that it can
    // modify state.editorState
    this.customPlugin = createCustomPlugin({
      editor: this,
    });
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
      this.initialContent = editorState.getCurrentContent();
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

  /**
   * Sets the block type/style at the current selection.  Type map can be found in utils/editor.
   * Only one block type/style can be applied, this will replace the previous.
   * @param {String} type The new block style
   */
  applyBlockStyle(type) {
    let editorState = this.state.editorState;
    editorState = RichUtils.toggleBlockType(editorState, type);
    this.setState({ editorState });
  }

  /**
   * Sets the color at the current selection for the specified category.
   * Type map can be found in utils/editor.
   * @param {String} type Category, TEXT or HIGHLIGHT
   * @param {String} color The new color name
   */
  applyColorStyle(type, color) {
    let editorState = this.state.editorState;
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
    this.setState({ editorState });
  }

  /**
   * Inserts a new image at current cursor selection.
   * @param {String} src The default <img> src
   * @param {Boolean} triggerModal Whether to trigger the img selection/resize modal on creation
   */
  insertImage(src, triggerModal) {
    let editorState = this.state.editorState;
    let contentState = editorState.getCurrentContent();

    // If the user has a range selected, it needs to be collapsed before insertText will work
    // This sets the starting and ending range to the same position,
    // which is equivalent to just a cursor/caret
    let sel = editorState.getSelection();
    const startKey = sel.getStartKey();
    const startOffset = sel.getStartOffset();
    sel = sel.merge({
      anchorKey: startKey,
      anchorOffset: startOffset,
      focusKey: startKey,
      focusOffset: startOffset,
    });

    contentState = contentState.createEntity('IMG', 'SEGMENTED', { src, triggerModal });
    const key = contentState.getLastCreatedEntityKey();

    // Using insertText so that images behave in an inline fashion
    contentState = Modifier.insertText(
      contentState,
      sel,
      ' ',
      null,
      key);

    editorState = EditorState.push(editorState, contentState, 'insert-characters');

    this.setState({ editorState });
  }

  /**
   * Inserts a new link at current cursor, or applies to selected text
   * @param {String} title Default title to display for the link, if no text is selected in range
   * @param {String} href The <a> href
   * @param {Boolean} triggerPopup Whether to trigger the popup on creation
   */
  insertLink(title, href, triggerPopup) {
    let editorState = this.state.editorState;
    let contentState = editorState.getCurrentContent();

    const sel = editorState.getSelection();

    contentState = contentState.createEntity('LINK', 'MUTABLE', { href, triggerPopup });
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

    this.setState({ editorState });
  }

  /**
   * Toggle an inline text style on/off
   * @param {String} styleName Name of the style
   * @return {String} The resulting style of the selection
   */
  toggleInlineStyle(styleName) {
    const editorState = RichUtils.toggleInlineStyle(this.state.editorState, styleName);
    this.setState({ editorState });
    return editorState.getCurrentInlineStyle();
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
            if (!connector.modified
              && this.initialContent
              && this.initialContent !== newState.getCurrentContent()
            ) {
              connector.modified = true;
            }
            connector.setFocusedEditor(hasFocus ? this : null, newState);
            this.setState({ editorState: newState });
          }}
          plugins={[
            this.state.markdown ? this.markdownPlugin : {},
            this.customPlugin,
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
