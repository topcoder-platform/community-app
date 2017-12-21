import Connector from 'components/Editor/Connector';
import Editor from 'components/Editor';
import EditorToolbar from 'components/Editor/Toolbar';
import MarkdownEditor from 'components/Editor/MarkdownEditor';
import MarkdownMonitor from 'components/Editor/MarkdownMonitor';
import React from 'react';
import './style.scss';

export default function EditorExample() {
  const connector = new Connector();
  return (
    <div>
      <EditorToolbar connector={connector} />
      <MarkdownMonitor connector={connector} />
      <div styleName="container">
        <div styleName="content">
          <h1 styleName="title">Editor</h1>
          <p styleName="text">
            Demo/test of content editing system based on DraftJS.
          </p>
          <h3 styleName="section">Editable Area #1</h3>
          <Editor
            connector={connector}
            initialContent="<p>Initial Content</p><p>Will it work?</p>"
          />
          <h3 styleName="section">Editable Area #2</h3>
          <Editor connector={connector} />
          <h3 styleName="section">Editable Area #3</h3>
          <Editor connector={connector} />
          <MarkdownEditor connector={connector} />
        </div>
      </div>
    </div>
  );
}
