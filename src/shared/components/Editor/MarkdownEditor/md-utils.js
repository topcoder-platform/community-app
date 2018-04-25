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

import shortId from 'shortid';

import inlineWrapperFactory from './inlineWrapperFactory';

import './style.scss';

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

  /**
   * Private.
   *
   * Merges and/or splits DraftJS blocks to ensure that the current block
   * contains exactly the specified number of lines.
   *
   * @param {Number} numLines
   */
  alignLines(numLines) {
    for (;;) {
      const text = this.content.getBlockForKey(this.key).getText();
      const numLinesInBlock = 1 + count(text, '\n');
      if (numLinesInBlock < numLines) {
        const nextKey = this.content.getKeyAfter(this.key);
        if (!nextKey) return;
        this.content = removeLastChar(this.content, this.key, text.length);
        this.content = insertChar(this.content, this.key, text.length, '\n');
        if (this.selection.getAnchorKey() === nextKey) {
          this.selection = this.selection.merge({
            anchorKey: this.key,
            anchorOffset: this.selection.getAnchorOffset() + text.length + 1,
          });
        }
        if (this.selection.getFocusKey() === nextKey) {
          this.selection = this.selection.merge({
            focusKey: this.key,
            focusOffset: this.selection.getFocusOffset() + text.length + 1,
          });
        }
      } else if (numLinesInBlock > numLines) {
        const splitPoint = findNth(text, '\n', numLines);
        this.content = removeChar(this.content, this.key, splitPoint);
        this.content = splitBlock(this.content, this.key, splitPoint);
        if (this.selection.getAnchorKey() === this.key
          && this.selection.getAnchorOffset() > splitPoint) {
          this.selection = this.selection.merge({
            anchorKey: this.content.getKeyAfter(this.key),
            anchorOffset: this.selection.getAnchorOffset() - splitPoint - 1,
          });
        }
        if (this.selection.getFocusKey() === this.key
          && this.selection.getFocusOffset() > splitPoint) {
          this.selection = this.selection.merge({
            focusKey: this.content.getKeyAfter(this.key),
            focusOffset: this.selection.getFocusOffset() - splitPoint - 1,
          });
        }
      } else return;
    }
  }

  getDecorations(block) {
    _.noop(this);
    const res = block.getData().get('decorations') || List();
    return res.setSize(block.getLength());
  }

  getComponentForKey(key) {
    _.noop(this);
    return inlineWrapperFactory(key, this.hrefs);
  }

  getPropsForKey() {
    _.noop(this);
    return {};
  }

  /**
   * Highlights Markdown syntax in the given DraftJS state.
   * @param {EditorState} state DraftJS EditorState that holds a plain text with
   *  a valid Markdown markup, previously loaded into this MdUtils instance via
   *  parse(..) method.
   * @return {EditorState} Resulting state with the proper formatting and
   *  styling of the markup.
   */
  highlight(state) {
    this.blockTypes = [];
    this.content = state.getCurrentContent();
    this.decorations = {};
    this.decoreLevel = 0;
    this.endLines = [];
    this.hrefs = {};
    this.key = this.content.getFirstBlock().getKey();
    this.selection = state.getSelection();
    this.styleLine = 0;
    this.tokenId = 0;
    this.tokens.forEach(() => this.highlightNextToken());
    while (this.key) {
      this.content = setBlockType(this.content, this.key, 'unstyled');
      this.highlightInline();
      this.key = this.content.getKeyAfter(this.key);
    }
    const res = EditorState.push(state, this.content, 'custom');
    return EditorState.acceptSelection(res, this.selection);
  }

  /**
   * Private.
   *
   * Highlights inline Markdown syntax in the current DraftJS block.
   */
  highlightInline(subTokens) {
    let pos = 0;
    const text = this.content.getBlockForKey(this.key).getText();
    const res = new Array(text.length);
    res.fill('mdSyntax');

    if (subTokens) {
      const styles = [];
      subTokens.forEach((st) => {
        switch (st.type) {
          case 'link_open': {
            const id = shortId().replace(/-/g, ':');
            [[, this.hrefs[id]]] = st.attrs;
            styles.push(`a:${id}`);
            break;
          }

          case 'em_open':
          case 'strong_open':
            styles.push(st.tag);
            break;

          case 's_open':
            styles.push('strike');
            break;

          case 'em_close':
          case 'link_close':
          case 's_close':
          case 'strong_close':
            styles.pop();
            break;

          case 'code_inline': {
            if (!st.content.length) break;
            let style = styles.join('-');
            if (!style) style = 'inlineCode';
            else style = `${style}-inlineCode`;
            pos = text.indexOf(st.content, pos);
            const end = pos + st.content.length;
            while (pos < end) {
              res[pos] = style;
              pos += 1;
            }
            break;
          }

          case 'text': {
            if (!st.content.length) break;
            pos = text.indexOf(st.content, pos);
            const end = pos + st.content.length;
            const style = styles.join('-') || 'text';
            while (pos < end) {
              res[pos] = style;
              pos += 1;
            }
            if (styles.length && _.last(styles).startsWith('a:')) {
              pos += 3 + _.last(styles).slice(2).length;
            }
            break;
          }

          default:
        }
      });
    }

    let i = text.length - 1;
    while (i >= 0 && text[i] === ' ') {
      res[i] = 'text';
      i -= 1;
    }
    while (i >= 0 && res[i] === 'mdSyntax') i -= 1;
    if (i < 0) res.fill('mdSyntax');

    const decorations = List(res);
    this.content = mergeBlockData(this.content, this.key, { decorations });
  }

  /**
   * Private.
   *
   * Highlights Markdown syntax in the specified number of lines, starting from
   * the first non-styled line.
   *
   * @param {Number} numLines
   */
  highlightLines(numLines) {
    this.alignLines(numLines);
    const type = this.blockTypes.join('-') || 'unstyled';
    this.content = setBlockType(this.content, this.key, type);
  }

  /**
   * Private.
   *
   * Highlights all Markdown syntax between the last highlighted DraftJS block
   * and the current MarkdownIt token.
   */
  highlightNextToken() {
    const token = this.tokens[this.tokenId];

    /* If token opens a new range, we:
     * -  Style any block before this token line;
     * -  Remember the range of this token, and the line of the first non-styled
     *    block. */
    if (token.map) {
      const linesBefore = token.map[0] - this.styleLine;
      if (linesBefore) {
        this.highlightLines(linesBefore);
        this.highlightInline();
        [this.styleLine] = token.map;
        this.key = this.content.getKeyAfter(this.key);
      }
    }

    switch (token.type) {
      case 'blockquote_open':
      case 'bullet_list_open':
        this.decoreLevel += 1;
        this.blockTypes.push(`${token.tag}:${this.decoreLevel}`);
        this.endLines.push(token.map[1]);
        break;

      case 'ordered_list_open':
        this.decoreLevel += 2;
        this.blockTypes.push(`${token.tag}:${this.decoreLevel}`);
        this.endLines.push(token.map[1]);
        break;

      case 'heading_open':
      case 'list_item_open':
      case 'paragraph_open':
        this.blockTypes.push(token.tag);
        this.endLines.push(token.map[1]);
        break;

      case 'blockquote_close':
      case 'bullet_list_close':
      case 'heading_close':
      case 'list_item_close':
      case 'ordered_list_close':
      case 'paragraph_close': {
        const linesBefore = _.last(this.endLines) - this.styleLine;
        if (linesBefore) {
          this.highlightLines(linesBefore);
          this.highlightInline();
          this.key = this.content.getKeyAfter(this.key);
          this.styleLine = _.last(this.endLines);
        }
        this.blockTypes.pop();
        this.endLines.pop();

        switch (token.type) {
          case 'blockquote_close':
          case 'bullet_list_close':
            this.decoreLevel -= 1;
            break;
          case 'ordered_list_close':
            this.decoreLevel -= 2;
            break;
          default:
        }

        break;
      }

      case 'fence': {
        this.blockTypes.push(token.tag);
        let numLines = token.map[1] - token.map[0];
        const subTokens = [{ type: 'text', content: token.content }];
        const isClosed = 1 + count(token.content, '\n') < numLines;
        if (!isClosed) {
          let i = 1 + this.tokenId;
          while (i < this.tokens.length && !this.tokens[i].map) i += 1;
          if (i === this.tokens.length
            || this.tokens[i].map[0] > token.map[1]) {
            numLines += 1;
          }
        }
        this.highlightLines(numLines);
        this.highlightInline(subTokens);
        this.key = this.content.getKeyAfter(this.key);
        [, this.styleLine] = token.map;
        this.blockTypes.pop();
        break;
      }

      case 'code_block':
      case 'hr': {
        this.blockTypes.push(token.tag);
        this.highlightLines(token.map[1] - token.map[0]);
        this.highlightInline(token.children);
        this.key = this.content.getKeyAfter(this.key);
        [, this.styleLine] = token.map;
        this.blockTypes.pop();
        break;
      }

      case 'inline':
        this.highlightLines(token.map[1] - token.map[0]);
        this.highlightInline(token.children);
        this.key = this.content.getKeyAfter(this.key);
        [, this.styleLine] = token.map;
        break;

      default:
    }

    this.tokenId += 1;
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
    this.tokens = this.markdown.parse(contentState.getPlainText(), this.env);
  }
}
