/**
 * <Toolbar> Component
 * Implements a Toolbar that can control multiple <Editor> components
 */
import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import Sticky from 'react-stickynode';

import { Button } from 'topcoder-react-ui-kit';
import Select from 'components/Select';
import { EDITOR_BLOCK_STYLE_MAP } from 'utils/editor';

import {
  RichUtils,
} from 'draft-js';

import ColorPicker from './ColorPicker';
import Connector from '../Connector';
import MultiEditor, { MODES } from '../MultiEditor';

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

  render() {
    const st = this.state;
    const disableStyling = !st.editor;
    const { connector } = this.props;

    const createStyleButton = (label, name, active, theme) => (
      <Button
        active={active}
        disabled={disableStyling}
        onMouseDown={(e) => {
          e.preventDefault();
          const newStyle = st.editor.toggleInlineStyle(name);
          this.setState({ [name]: newStyle.has(name) });
        }}
        size="sm"
        theme={{ button: theme }}
      >{label}</Button>
    );

    return (
      <Sticky innerZ={2}>
        <div id={this.props.nodeId} styleName="container">
          {
            connector.focusedEditor instanceof MultiEditor ? (
              <div styleName="select-wrapper">
                <Select
                  autoBlur
                  clearable={false}
                  className={style.select}
                  disabled={disableStyling}
                  onChange={({ value }) => {
                    connector.focusedEditor.setMode(value);
                  }}
                  onFocus={e => e.preventDefault()}
                  options={[{
                    label: 'Mode: WYSIWYG',
                    value: MODES.WYSIWYG,
                  }, {
                    label: 'Mode: Markdown',
                    value: MODES.MARKDOWN,
                  }]}
                  placeholder="Block Style"
                  value={connector.focusedEditor.state.mode}
                />
              </div>
            ) : null
          }

          <Button
            // disabled={!this.props.connector.modified}
            onClick={() => this.props.onSave()}
            size="sm"
            theme={{ button: style.basic }}
          >Save</Button>
          <div styleName="separator" />

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
              this.setState({ pickingTextColor: !st.pickingTextColor });
            }}
            size="sm"
            theme={{ button: style.basic }}
          >Color</Button>
          <ColorPicker
            onChange={(color) => {
              const editor = st.editor || this.props.connector.previousEditor;
              editor.focus();
              setImmediate(() => {
                editor.applyColorStyle('TEXT', color);
                this.setState({ pickingTextColor: false });
              });
            }}
            style={style['text-color-picker']}
            visible={st.pickingTextColor}
          />

          {
            /* NOTE: The Highlight buttons is commented out because of an ask
             * not to show this option in the challenge specs editor, at least
             * for now. A better solution we should implement in future will be
             * to customize permitted operations via editor props, thus not
             * removing the button code. */
            /*
              <Button
                disabled={disableStyling}
                onMouseDown={(e) => {
                  e.preventDefault();
                  this.setState({ pickingHighlightColor: !st.pickingHighlightColor });
                }}
                size="sm"
                theme={{ button: style.basic }}
              >Highlight</Button>
              <ColorPicker
                onChange={(color) => {
                  const editor = st.editor || this.props.connector.previousEditor;
                  editor.focus();
                  setImmediate(() => {
                    editor.applyColorStyle('HIGHLIGHT', color);
                    this.setState({ pickingHighlightColor: false });
                  });
                }}
                style={style['highlight-color-picker']}
                visible={st.pickingHighlightColor}
              />
            */
          }

          <div styleName="separator" />

          <Button
            disabled={disableStyling}
            onMouseDown={(e) => {
              e.preventDefault();
              st.editor.insertLink(' Link', 'http://', true);
            }}
            size="sm"
            theme={{ button: style.basic }}
          >Insert Link</Button>

          <Button
            disabled={disableStyling}
            onMouseDown={(e) => {
              e.preventDefault();
              st.editor.insertImage('http://', true);
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
              onChange={({ value }) => {
                st.editor.applyBlockStyle(value);
                this.setState({ block: value });
              }}
              onFocus={e => e.preventDefault()}
              options={_.map(EDITOR_BLOCK_STYLE_MAP, (label, value) => ({ label, value }))}
              placeholder="Block Style"
              value={st.editor ? st.block : null}
            />

          </div>

          {
            /* I guess, we gonna drop the inline Markdown option. Just for
             * a case, let's keep the button code around for a bit longer. */
            /*
              <Button
                active={st.markdown}
                disabled
                onMouseDown={(e) => {
                  e.preventDefault();
                  const active = !st.markdown;
                  this.setState({ markdown: active });
                  this.props.connector.toggleInlineMarkdown(active);
                }}
                size="sm"
                theme={{ button: style.basic }}
              >Inline Markdown</Button>
            */
          }
        </div>
      </Sticky>
    );
  }
}

Toolbar.defaultProps = {
  connector: new Connector(),
  onSave: _.noop,
  nodeId: null,
};

Toolbar.propTypes = {
  connector: PT.instanceOf(Connector),
  onSave: PT.func,
  nodeId: PT.string,
};
