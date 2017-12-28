/**
 * Markdown editor.
 */

import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';

import { ContentState, convertFromHTML, EditorState } from 'draft-js';

import BlockWrapper from './BlockWrapper';
import Connector from '../Connector';
import GenericEditor from '../GenericEditor';
import MdUtils from './md-utils';

import style from './style.scss'; // eslint-disable-line no-unused-vars

export default class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props);
    _.merge(this, {
      id: props.id,
      mdUtils: new MdUtils(),
    });
  }

  componentDidMount() {
    const { connector, initialContent } = this.props;
    connector.addEditor(this);
    if (initialContent) {
      let state = initialContent.replace(/\n/g, '<br />');
      state = convertFromHTML(state);
      state = ContentState.createFromBlockArray(
        state.contentBlocks,
        state.entityMap,
      );
      // console.log(initialContent, state.getPlainText());
      state = EditorState.createWithContent(state, this.mdUtils);
      this.onChange(state);
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

  onChange(newState) {
    const { connector } = this.props;
    this.mdUtils.parse(newState.getCurrentContent());
    if (connector && connector.previewer) {
      connector.previewer.setContent(this.mdUtils.getHtml());
    }
    if (this.editor) {
      const selfState = this.mdUtils.highlight(newState);
      if (selfState !== newState) {
        this.editor.setEditorState(selfState);
      }
    }
  }

  getHtml() {
    return this.mdUtils.getHtml();
  }

  render() {
    return (
      <div styleName="style.container">
        <GenericEditor
          blockRendererFn={block => ({
            component: BlockWrapper,
            editable: true,
            props: { type: block.getType() },
          })}
          decorator={this.mdUtils}
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
