/**
 * Markdown editor.
 */

import PT from 'prop-types';
import React from 'react';
import Turndown from 'turndown';

import { ContentState, convertFromHTML, EditorState } from 'draft-js';

import BlockWrapper from './BlockWrapper';
import Connector from '../Connector';
import GenericEditor from '../GenericEditor';
import MdUtils from './md-utils';

import ImageEditor from '../Image/EditModal';

import style from './style.scss'; // eslint-disable-line no-unused-vars

const GUI_STATES = {
  IMAGE_EDIT_MODAL: 'IMAGE_EDIT_MODAL',
  REGULAR: 'REGULAR',
};

export default class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props);
    this.mdUtils = new MdUtils();
    this.state = {
      editor: EditorState.createEmpty(this.mdUtils),
      gui: GUI_STATES.REGULAR,
    };
    this.turndown = new Turndown();
  }

  componentDidMount() {
    const { initialContent } = this.props;
    if (initialContent) {
      let state = initialContent.replace(/\n/g, '<br />');
      state = convertFromHTML(state);
      state = ContentState.createFromBlockArray(
        state.contentBlocks,
        state.entityMap,
      );
      state = EditorState.createWithContent(state, this.mdUtils);
      this.onChange(state);
    }
  }

  onChange(newState) {
    const { connector } = this.props;
    this.mdUtils.parse(newState.getCurrentContent());
    if (connector && connector.previewer) {
      connector.previewer.setVisible(true);
      connector.previewer.setContent(this.mdUtils.getHtml());
    }
    if (this.editor) {
      const selfState = this.mdUtils.highlight(newState);
      if (selfState !== newState) {
        this.setState({ editor: selfState });
      }
    }
  }

  getHtml() {
    return this.mdUtils.getHtml();
  }

  setHtml(html) {
    let state = this.turndown.turndown(html);
    state = state.replace(/\n/g, '<br />');
    state = convertFromHTML(state);
    state = ContentState.createFromBlockArray(
      state.contentBlocks,
      state.entityMap,
    );
    state = EditorState.createWithContent(state, this.mdUtils);
    this.onChange(state);
  }

  insertImage() {
    setImmediate(() => this.setState({ gui: GUI_STATES.IMAGE_EDIT_MODAL }));
  }

  render() {
    const { connector, id } = this.props;
    const st = this.state;
    return (
      <div styleName="style.container">
        {
          st.gui === GUI_STATES.IMAGE_EDIT_MODAL ? (
            <ImageEditor
              onCancel={() => this.setState({ gui: GUI_STATES.REGULAR })}
            />
          ) : null
        }
        <GenericEditor
          blockRendererFn={block => ({
            component: BlockWrapper,
            editable: true,
            props: { type: block.getType() },
          })}
          connector={connector}
          decorator={this.mdUtils}
          editorState={this.state.editor}
          id={id}
          onChange={state => this.onChange(state)}
          ref={(node) => { this.editor = node; }}
        />
      </div>
    );
  }
}

MarkdownEditor.defaultProps = {
  connector: new Connector(),
  id: null,
  initialContent: null,
};

MarkdownEditor.propTypes = {
  connector: PT.shape(),
  id: PT.string,
  initialContent: PT.string,
};
