/**
 * Markdown utilities for DraftJS editor.
 *
 * There are plenty of Markdown-related plugins for DraftJS in Internet, but it
 * looks like nobody made it right so far; thus here we go with the correct
 * solution.
 */

import _ from 'lodash';
import Markdown from 'markdown-it';

import {
  EditorState,
  SelectionState,
  Modifier,
} from 'draft-js';

import { List } from 'immutable';

import inlineWrapperFactory from './inlineWrapperFactory';

import './style.scss';

/* Regular experssion to capture pure reference blocks. */
/* This captures ref key (mind that \\ in this string turns into just \ in the
 * regex code; thus, for example, \\\\ turns into \\ which means just a single
 * escaped \ when the match is done; similarly \\\] means just an escaped ]
 * character during the match. */
let REF_REGEX = '([^\\\\\\]]|\\\\\\\\|\\\\\\])+';
/* This caputres ref key, decorated with brackets, semi-column, and leading
 * spaces. */
REF_REGEX = `^\\s{0,3}\\[${REF_REGEX}\\]:\\s*`;
/* And here we add the valid link match. */
REF_REGEX = new RegExp(`${REF_REGEX}[^\\s]+\\s*$`);

/**
 * Counts the specified characters in the given string.
 * @param {String} string
 * @param {String} char
 * @return {Number}
 */
function count(string, char) {
  let pos = -1;
  let res = 0;
  for (;;) {
    const c = string[pos += 1];
    if (c === char) res += 1;
    else if (!c) return res;
  }
}

/**
 * Finds position of the n-th occurance of the specified character in the given
 * string, and returns it. Returns -1, if not found.
 * @param {String} string
 * @param {String} char
 * @param {Number} n
 * @return {Number}
 */
function findNth(string, char, n) {
  let pos = -1;
  let res = n;
  for (;;) {
    const c = string[pos += 1];
    if (c === char) res -= 1;
    if (!res) return pos;
    if (!c) return -1;
  }
}

/* Internal. */
function newSelector(key, pos = 0, end, endKey) {
  return SelectionState.createEmpty(key).merge({
    anchorOffset: pos,
    focusKey: endKey === undefined ? key : endKey,
    focusOffset: end === undefined ? pos : end,
  });
}

/* Internal. */
function insertChar(content, key, pos, char) {
  return Modifier.insertText(content, newSelector(key, pos), char);
}


/* Internal. */
function mergeBlockData(content, key, data) {
  return Modifier.mergeBlockData(content, newSelector(key), data);
}

/* Internal. */
function removeChar(content, key, pos) {
  return Modifier.removeRange(content, newSelector(key, pos, pos + 1));
}

/* Internal. */
function removeLastChar(content, key, pos) {
  const s = newSelector(key, pos, 0, content.getKeyAfter(key));
  return Modifier.removeRange(content, s);
}

/* Internal. */
function splitBlock(content, key, pos) {
  return Modifier.splitBlock(content, newSelector(key, pos));
}

/* Internal. */
function setBlockType(content, key, type) {
  const block = content.getBlockForKey(key);
  if (block.getType() === type) return content;
  return Modifier.setBlockType(content, newSelector(key, 0), type);
}

/* Internal. */
function adjustBlock(context, token) {
  const { maxLine, prevTokenType } = context;
  let { content, key, selection } = context;
  let numLinesInToken = 1 + count(token.content, '\n');
  switch (token.type) {
    case 'blockquote_close':
      if (prevTokenType === 'blockquote_open') break;
      return context;

    case 'code_block':
      if (token.content.endsWith('\n')) numLinesInToken -= 1;
      break;

    case 'fence':
      if (token.map[0] + numLinesInToken < maxLine) {
        numLinesInToken += 1;
      }
      break;

    case 'heading_close':
      if (token.markup === '=' || token.markup === '-') break;
      return context;

    case 'hr':
    case 'inline': break;

    case 'list_item_close':
      if (prevTokenType === 'list_item_open') break;
      return context;

    default: return context;
  }
  for (;;) {
    const text = content.getBlockForKey(key).getText();
    if (!text.length || text.match(REF_REGEX)) {
      key = content.getKeyAfter(key);
    } else if (text[0] === '\n') {
      content = splitBlock(content, key, 0);
      const oldKey = key;
      key = content.getKeyAfter(key);
      content = removeChar(content, key, 0);
      if (selection.getAnchorKey() === oldKey
      && selection.getAnchorOffset()) {
        selection = selection.merge({
          anchorKey: key,
          anchorOffset: selection.getAnchorOffset() - 1,
        });
      }
      if (selection.getFocusKey() === oldKey
      && selection.getFocusOffset()) {
        selection = selection.merge({
          focusKey: key,
          focusOffset: selection.getFocusOffset() - 1,
        });
      }
    } else {
      const numLinesInBlock = 1 + count(text, '\n');
      if (numLinesInBlock < numLinesInToken) {
        const goneKey = content.getKeyAfter(key);
        if (!goneKey) return { ...context, content, key, selection };
        content = removeLastChar(content, key, text.length);
        content = insertChar(content, key, text.length, '\n');
        if (selection.getAnchorKey() === goneKey) {
          selection = selection.merge({
            anchorKey: key,
            anchorOffset: selection.getAnchorOffset() + text.length + 1,
          });
        }
        if (selection.getFocusKey() === goneKey) {
          selection = selection.merge({
            focusKey: key,
            focusOffset: selection.getFocusOffset() + text.length + 1,
          });
        }
      } else {
        if (numLinesInBlock > numLinesInToken) {
          const splitPoint = findNth(text, '\n', numLinesInToken);
          content = removeChar(content, key, splitPoint);
          content = splitBlock(content, key, splitPoint);
          if (selection.getAnchorKey() === key
          && selection.getAnchorOffset() > splitPoint) {
            selection = selection.merge({
              anchorKey: content.getKeyAfter(key),
              anchorOffset: selection.getAnchorOffset() - 1 - splitPoint,
            });
          }
          if (selection.getFocusKey() === key
          && selection.getFocusOffset() > splitPoint) {
            selection = selection.merge({
              focusKey: content.getKeyAfter(key),
              focusOffset: selection.getFocusOffset() - 1 - splitPoint,
            });
          }
        }
        return {
          ...context,
          content,
          key,
          selection,
        };
      }
    }
  }
}

/* Internal. */
function decorateBlock(context, token) {
  const { blockTypes, key, prevTokenType, styled } = context;
  let { content } = context;
  switch (token.type) {
    case 'code_block':
    case 'fence':
    case 'hr': {
      blockTypes.push(token.tag);
      content = setBlockType(content, key, blockTypes.join('-'));
      blockTypes.pop();
      styled.add(key);
      break;
    }

    case 'inline': {
      content = setBlockType(content, key, blockTypes.join('-'));
      styled.add(key);
      break;
    }

    case 'blockquote_open':
    case 'bullet_list_open':
    case 'heading_open':
    case 'list_item_open':
    case 'ordered_list_open':
    case 'paragraph_open':
      blockTypes.push(token.tag);
      break;

    case 'blockquote_close':
      if (prevTokenType === 'blockquote_open') {
        content = setBlockType(content, key, blockTypes.join('-'));
        styled.add(key);
      }
      blockTypes.pop();
      break;

    case 'heading_close':
      if (token.markup === '=' || token.markup === '-') {
        content = setBlockType(content, key, blockTypes.join('-'));
        styled.add(key);
      }
      blockTypes.pop();
      break;

    case 'list_item_close':
      if (prevTokenType === 'list_item_open') {
        content = setBlockType(content, key, blockTypes.join('-'));
        styled.add(key);
      }
      blockTypes.pop();
      break;

    case 'bullet_list_close':
    case 'ordered_list_close':
    case 'paragraph_close':
      blockTypes.pop();
      break;

    default:
  }

  return { ...context, content };
}

function generateDecorations(context, token) {
  let pos = 0;
  const { content, key } = context;
  const text = content.getBlockForKey(key).getText();
  let res = new Array(text.length);
  res.fill('mdSyntax');

  let children = token.children || [];
  switch (token.type) {
    case 'fence':
      children = [{ type: 'text', content: token.content }];
      break;
    default:
  }

  const styles = [];
  children.forEach((st) => {
    switch (st.type) {
      case 'em_open':
      case 'strong_open':
        styles.push(st.tag);
        break;

      case 'em_close':
      case 'strong_close':
        styles.pop();
        break;

      case 'text': {
        if (!st.content.length) break;
        pos = text.indexOf(st.content, pos);
        const end = pos + st.content.length;
        const style = styles.join('-') || null;
        while (pos < end) {
          res[pos] = style;
          pos += 1;
        }
        break;
      }

      default:
    }
  });

  res = List(res);

  const block = context.content.getBlockForKey(context.key);
  const prev = block.getData().get('decorations');
  if (prev && res.equals(prev)) return context;

  return {
    ...context,
    content: mergeBlockData(context.content, context.key, { decorations: res }),
  };
}

export default class MdUtils {
  /**
   * Constructs a new MdUtils instance.
   * @param {ContentState} contentState Optional. If provided, constructor will
   *  automatically call parse(contentState) in the end of initialization.
   */
  constructor(contentState) {
    this.markdown = new Markdown();
    this.markdown.disable(['table']);
    this.tokens = [];
    if (contentState) this.parse(contentState);
  }

  getDecorations(block) {
    _.noop(this);
    const res = block.getData().get('decorations') || List();
    return res.setSize(block.getLength());
  }

  getComponentForKey(key) {
    _.noop(this);
    return inlineWrapperFactory(key);
  }

  getPropsForKey() {
    _.noop(this);
    return {};
  }

  /**
   * Highlights Markdown block syntax in the given DraftJS state.
   * @param {EditorState} state DraftJS EditorState that holds a plain text with
   *  the valid Mardown markup, previously loaded into this MdUtils instance via
   *  parse(..) method.
   * @return {EditorState} DraftJS EditorState that holds the same plain text
   *  with Markdown markup, but with the block structure updated to match the
   *  Mardown content, and with the block-level styling set to mimin Markdown
   *  rendering output.
   */
  highlightBlocks(state) {
    let context = {
      blockTypes: [],
      content: state.getCurrentContent(),
      decorations: {},
      maxLine: Number.MAX_VALUE,
      prevTokenType: '',
      selection: state.getSelection(),
      styled: new Set(),
    };
    context.key = context.content.getFirstBlock().getKey();
    console.log(context.content.getBlocksAsArray().length);
    this.tokens.forEach((token, i) => {
      let j = 1 + i;
      while ((j < this.tokens.length) && !this.tokens[j].map) j += 1;
      if (j >= this.tokens.length) context.maxLine = Number.MAX_VALUE;
      else context.maxLine = this.tokens[j].map[0];
      context = adjustBlock(context, token);
      context = decorateBlock(context, token);
      context.prevTokenType = token.type;
      if (context.styled.has(context.key)) {
        context = generateDecorations(context, token);
        context.key = context.content.getKeyAfter(context.key);
      }
    });
    context.content.getBlocksAsArray().forEach((block) => {
      const key = block.getKey();
      if (context.styled.has(key)) return;
      context.content = setBlockType(context.content, key, 'div');
    });
    const res = EditorState.push(state, context.content, 'custom');
    // res = EditorState.set(res, { decorator: this });
    return EditorState.acceptSelection(res, context.selection);
  }

  /**
   * Returns HTML representation of the Markdown markup previously loaded by
   * parse(..) method of MdUtils.
   * @return {String}
   */
  getHtml() {
    if (!this.html) {
      this.html = this.markdown.renderer.render(this.tokens, this.env);
    }
    return this.html;
  }

  /**
   * Parses the given DraftJS state. The state should contain a plain text with
   * Markdown markup. After the parse you can call other methods of MdUtils to
   * generate corresponding HTML markup, or DraftJS state for rendered Markdown
   * representation, or DraftJS decorator for Markdown syntax highlighting in
   * the original state.
   * @param {ContentState} state 
   */
  parse(contentState) {
    delete this.html;
    this.env = {};
    this.tokens = this.markdown.parse(
      contentState.getPlainText(), this.env);
    console.log(this.tokens, this.env);
  }
}
