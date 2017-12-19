import Connector from 'components/Editor/Connector';
import Editor from 'components/Editor';
import EditorToolbar from 'components/Editor/Toolbar';
import React from 'react';
import './style.scss';

export default function EditorExample() {
  const connector = new Connector();
  return (
    <div>
      <EditorToolbar connector={connector} />
      <div styleName="container">
        <div styleName="content">
          <h1 styleName="title">Editor</h1>
          <p styleName="text">
            Demo/test of content editing system based on DraftJS.
          </p>
          <Editor
            connector={connector}
            initialContent="<p>Initial Content</p><p>Will it work?</p>"
          />
          <Editor connector={connector} />
          <Editor connector={connector} />
        </div>
      </div>
    </div>
  );
}
