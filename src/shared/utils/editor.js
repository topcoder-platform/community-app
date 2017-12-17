/**
* Utility functions and settings for Editor components:
*
*   editorStateToHTML
*
*/
import _ from 'lodash';
import { stateToHTML } from 'draft-js-export-html';

// List of colors that editor and toolbar will use as options for text and highlighting
export const EDITOR_COLOR_MAP = {
  BLACK: '#262628',
  GREY: '#747480',
  WHITE: '#ffffff',
  BLUE: '#26ade9',
  GREEN: '#60c700',
  ORANGE: '#fb7d22',
  YELLOW: '#fce217',
  RED: '#f22e24',
};

// These are just temporary defaults, there will be a more complete solution
// implemented in the future
export const EDITOR_BLOCK_STYLE_MAP = {
  unstyled: 'Default',
  'header-two': 'Section Title',
  'header-three': 'Subsection Title',
  'header-four': 'List Title',
  'ordered-list-item': 'Numbered List',
  'unordered-list-item': 'Bullet List',
  'code-block': 'Code',
  blockquote: 'Blockquote',
  note: 'Note',
};

/**
 * Converts editorState into HTML which supports text color, highlighting and the notes block
 *
 * @param {Object} editor Editor that contains the link, may be different than currently focused
 * @param {String} key The entity key of the link to be updated
 * @param {Object} data Entity data to be merged into the contentState. { href, title }
 */
export const editorStateToHTML = (state) => {
  const inlineStyles = {};

  _.forIn(EDITOR_COLOR_MAP, (value, name) => {
    inlineStyles[`TEXT_${name}`] = { style: { color: value } };
    inlineStyles[`HIGHLIGHT_${name}`] = { style: { background: value } };
  });

  const options = {
    blockStyleFn: block => (block === 'NOTE' ? ({ attributes: { class: 'editor-note-global' } }) : null),
    inlineStyles,
  };

  return stateToHTML(state, options);
};

export default null;
