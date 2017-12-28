/**
 * Markdown editor.
 */

import PT from 'prop-types';
import React from 'react';

import BlockWrapper from './BlockWrapper';
import GenericEditor from '../GenericEditor';
import MdUtils from './md-utils';

import style from './style.scss'; // eslint-disable-line no-unused-vars

export default class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props);
    this.mdUtils = new MdUtils();
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
  connector: null,
};

MarkdownEditor.propTypes = {
  connector: PT.shape(),
};
