/** Codeblocks formatter + highlighter component
 *
 * Renders <pre><code>...</pre></code> blocks with properly
 * formatted code and applies highlighting with default theme to it.
 */

import React from 'react';
import PT from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter';

const beautify = require('js-beautify').js;
// beautify config
const beautifyConf = {
  indent_size: 2,
  indent_char: ' ',
  max_preserve_newlines: 2,
  preserve_newlines: true,
  keep_array_indentation: true,
  break_chained_methods: true,
  indent_scripts: 'separate',
  brace_style: 'collapse',
  space_before_conditional: true,
  unescape_strings: true,
  jslint_happy: true,
  end_with_newline: true,
  wrap_line_length: 0,
  indent_inner_html: true,
  comma_first: false,
  e4x: true,
  indent_empty_lines: false,
};
// highlighter theme - `VS`
// need to define it here as import breaks the styles globally
const vs = {
  hljs: {
    display: 'block',
    overflowX: 'auto',
    padding: '0.5em',
    background: 'white',
    color: 'black',
  },
  'hljs-comment': {
    color: '#008000',
  },
  'hljs-quote': {
    color: '#008000',
  },
  'hljs-variable': {
    color: '#008000',
  },
  'hljs-keyword': {
    color: '#00f',
  },
  'hljs-selector-tag': {
    color: '#00f',
  },
  'hljs-built_in': {
    color: '#00f',
  },
  'hljs-name': {
    color: '#00f',
  },
  'hljs-tag': {
    color: '#00f',
  },
  'hljs-string': {
    color: '#a31515',
  },
  'hljs-title': {
    color: '#a31515',
  },
  'hljs-section': {
    color: '#a31515',
  },
  'hljs-attribute': {
    color: '#a31515',
  },
  'hljs-literal': {
    color: '#a31515',
  },
  'hljs-template-tag': {
    color: '#a31515',
  },
  'hljs-template-variable': {
    color: '#a31515',
  },
  'hljs-type': {
    color: '#a31515',
  },
  'hljs-addition': {
    color: '#a31515',
  },
  'hljs-deletion': {
    color: '#2b91af',
  },
  'hljs-selector-attr': {
    color: '#2b91af',
  },
  'hljs-selector-pseudo': {
    color: '#2b91af',
  },
  'hljs-meta': {
    color: '#2b91af',
  },
  'hljs-doctag': {
    color: '#808080',
  },
  'hljs-attr': {
    color: '#f00',
  },
  'hljs-symbol': {
    color: '#00b0e8',
  },
  'hljs-bullet': {
    color: '#00b0e8',
  },
  'hljs-link': {
    color: '#00b0e8',
  },
  'hljs-emphasis': {
    fontStyle: 'italic',
  },
  'hljs-strong': {
    fontWeight: 'bold',
  },
};


function Highlighter({
  codeString,
  language,
  showLineNumbers,
}) {
  return (
    <SyntaxHighlighter
      language={language}
      style={vs}
      showLineNumbers={showLineNumbers}
      key={new Date().getTime()}
    >
      {beautify(codeString, beautifyConf)}
    </SyntaxHighlighter>
  );
}

Highlighter.defaultProps = {
  codeString: '',
  language: 'plaintext',
  showLineNumbers: false,
};

Highlighter.propTypes = {
  codeString: PT.string,
  language: PT.string,
  showLineNumbers: PT.bool,
};

export default Highlighter;
