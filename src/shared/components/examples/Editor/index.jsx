import Connector from 'components/Editor/Connector';
import Editor from 'components/Editor';
import EditorToolbar from 'components/Editor/Toolbar';
import MarkdownEditor from 'components/Editor/MarkdownEditor';
// import Previewer from 'components/Editor/Previewer';
import React from 'react';
// import Sticky from 'react-stickynode';
import './style.scss';

export default function EditorExample() {
  const connector = new Connector();
  return (
    <div>
      <EditorToolbar
        connector={connector}
        nodeId="editor-toolbar"
      />
      {/*
          <Sticky innerZ={2} top="#editor-toolbar">
            <Previewer connector={connector} />
          </Sticky>
      */}
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
          <h3 styleName="section">Markdown Editor Test</h3>
          <MarkdownEditor connector={connector} />
        </div>
      </div>
    </div>
  );
}
