import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import Sticky from 'react-stickynode';

import Select from 'components/Select';
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

  toggleInlineMarkdown(markdown) {
    this.editors.forEach(editor => editor.setState({ markdown }));
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
      block: null,
      editor: null,
      markdown: false,
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

  setBlockType(newType) {
    let editorState = this.state.editor ? this.state.editor.state.editorState : null;
    if (editorState) {
      editorState = RichUtils.toggleBlockType(editorState, newType);
      this.setState({ block: newType });
      this.state.editor.setState({ editorState });
    }
  }

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

    const createStyleButton = (label, name, active, theme) => (
      <Button
        active={active}
        disabled={!st.editor}
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
            theme={{ button: style.save }}
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
            theme={{ button: style.markdown }}
          >Inline Markdown</Button>
          <div styleName="separator" />
          { createStyleButton('B', 'BOLD', st.BOLD, style.bold) }
          { createStyleButton('I', 'ITALIC', st.ITALIC, style.italic) }
          { createStyleButton('U', 'UNDERLINE', st.UNDERLINE, style.underline) }
          { createStyleButton('S', 'STRIKETHROUGH', st.STRIKETHROUGH, style.strikethrough) }
          { createStyleButton('Monospace', 'CODE', st.CODE, style.inlineCode) }
          <div styleName="select-wrapper">
            <Select
              autoBlur
              clearable={false}
              className={style.select}
              disabled={!st.editor}
              onChange={option => this.setBlockType(option.value)}
              onFocus={e => e.preventDefault()}
              options={[
                {
                  label: 'Default',
                  value: 'unstyled',
                },
                {
                  label: 'Section Title',
                  value: 'header-two',
                },
                {
                  label: 'Subsection Title',
                  value: 'header-three',
                },
                {
                  label: 'List Title',
                  value: 'header-four',
                },
                {
                  label: 'Ordered List',
                  value: 'ordered-list-item',
                },
                {
                  label: 'Unordered List',
                  value: 'unordered-list-item',
                },
                {
                  label: 'Code',
                  value: 'code-block',
                },
                {
                  label: 'Blockquote',
                  value: 'blockquote',
                },
                {
                  label: 'Note',
                  value: 'note',
                },
              ]}
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
