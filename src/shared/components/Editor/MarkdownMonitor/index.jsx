import PT from 'prop-types';
import React from 'react';

import Editor from '..';
import './style.scss';

export default function MarkdownMonitor({ connector }) {
  return (
    <div>
      MARKDOWN Monitor
      <Editor
        ref={(node) => {
          if (connector) connector.setMarkdownMonitor(node);
        }}
        styleName="editor"
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
