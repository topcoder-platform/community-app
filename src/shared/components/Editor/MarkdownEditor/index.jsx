/**
 * Markdown editor.
 */

import Immutable from 'immutable';
import Markdown from 'markdown-it';
import Prism from 'prismjs';
import PT from 'prop-types';
import PrismDecorator from 'draft-js-prism';
import React from 'react';

import { CompositeDecorator, EditorBlock, EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import { stateFromMarkdown } from 'draft-js-import-markdown';

import 'prismjs/components/prism-markdown';
import 'prismjs/themes/prism.css';

import BlockWrapper from './BlockWrapper';
import GenericEditor from '../GenericEditor';
// import MarkdownGithubSyntax from './markdown-github-syntax';
import MdUtils from './md-utils';

import style from './style.scss'; // eslint-disable-line no-unused-vars

/* Default Prism definition for Markdown syntax decoration is far not perfect,
 * thus we enhance it here. */

/* Better rules for headings. */
/*
delete Prism.languages.markdown.title;
for (let i = 1; i <= 6; i += 1) {
  Prism.languages.markdown[`h${i}`] = {
    inside: {
      [`markupH${i}l`]: new RegExp(`^\\s{0,3}#{${i}}\\s`),
      [`markupH${i}r`]: /\s#+\s*$/,
    },
    pattern: new RegExp(`^\\s{0,3}#{${i}}\\s.*`),
  };
}
*/

// console.log(Prism.languages.markdown);

// Prism.languages.markdown = MarkdownGithubSyntax;

function render(renderProps) {
  return (
    <span
      className={`prism-token token ${renderProps.type}`}
    >{renderProps.children}</span>
  );
}

function blockStyleFn(block) {
  // console.log('>>>', block.getType());
  switch (block.getType()) {
    case 'h1': return style.blockH1;
    default: return style.defaultBlock;
  }
}

const blockRenderMap = Immutable.Map({
  code: { element: 'code' },
  div: { element: 'div' },
  h1: { element: 'h1' },
  h2: { element: 'h2' },
  h3: { element: 'h3' },
  h4: { element: 'h4' },
  h5: { element: 'h5' },
  h6: { element: 'h6' },
  p: { element: 'p' },
});

export default function MarkdownEditor({ connector }) {
  const decorator = new PrismDecorator({
    defaultSyntax: 'markdown',
    filter: () => true,
    prism: Prism,
    render,
  });

  const onChange = (newState) => {
    const mdUtils = new MdUtils(newState.getCurrentContent());
    if (connector && connector.previewer) {
      connector.previewer.setContent(mdUtils.getHtml());
      // console.log(mdUtils.getHtml());
    }
    if (this.editor) {
      const selfState = mdUtils.highlightBlocks(newState);
      // console.log(selfState);
      if (selfState !== newState) this.editor.setEditorState(selfState);
    }
  };

  const dec = new CompositeDecorator([{
    strategy: (block, cb, contentState) => {
      const text = block.getText();
      cb(0, text.length);
    },
    component: props => <span className="A">{props.children}</span>,
  }, {
    strategy: (block, cb, contentState) => {
      const text = block.getText();
      cb(text.length / 3, text.length / 2);
    },
    component: props => <span className="B">{props.children}</span>,
  }]);

  return (
    <div styleName="style.container">
      <GenericEditor
        blockRendererFn={(block) => {
          return {
            component: BlockWrapper,
            editable: true,
            props: { type: block.getType() },
          };
        }}
        // blockRenderMap={blockRenderMap}
        blockStyleFn={blockStyleFn}
        // decorator={dec}
        onChange={onChange}
        ref={(node) => { this.editor = node; }}
      />
    </div>
  );
}

MarkdownEditor.defaultProps = {
  connector: null,
};

MarkdownEditor.propTypes = {
  connector: PT.shape(),
};
