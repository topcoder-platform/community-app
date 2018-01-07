import PT from 'prop-types';
import React from 'react';

import Editor from '..';
import style from './style.scss';

export default function MarkdownMonitor({ connector }) {
  return (
    <div styleName="container">
      <div styleName="title">Markdown Rendering Preview</div>
      <Editor
        ref={(node) => {
          if (connector) connector.setMarkdownMonitor(node);
        }}
        styleName="editor"
        theme={{ container: style.editor }}
      />
    </div>
  );
}

MarkdownMonitor.defaultProps = {
  connector: null,
};

MarkdownMonitor.propTypes = {
  connector: PT.shape(),
};
