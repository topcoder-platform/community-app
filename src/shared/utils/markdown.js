/**
 * Renders markdown into native React components.
 * In most cases the <MarkdownRenderer> component should be utilized instead of
 * using this directly.
 *
 * Additional custom components can be added to the customComponents array found below.
 */

import _ from 'lodash';
import { createElement } from 'react';
import MarkdownIt from 'markdown-it';
import { Button, PrimaryButton, SecondaryButton } from 'topcoder-react-ui-kit';
import { Link } from 'topcoder-react-utils';
import shortid from 'shortid';

import JoinCommunity from 'containers/tc-communities/JoinCommunity';

/**
 * Add new Custom Components here.
 *
 * When a tag is encountered, this object is checked to see if it contains a field
 * with the name of the tag ( case sensitive ).
 * If it exists, the corresponding function will be called with the tag attributes.
 *
 * The function should return an objecting containing:
 *    type: The React Component
 *    props: The props to use when creating the component.
 *    These can simply be the passed attributes, or props derived from them
 *    in some way. Ex. Creating an array from a comma delimited string.
 */
const customComponents = {
  Button: attrs => ({ type: Button, props: attrs }),
  PrimaryButton: attrs => ({ type: PrimaryButton, props: attrs }),
  SecondaryButton: attrs => ({ type: SecondaryButton, props: attrs }),
  Link: attrs => ({ type: Link, props: attrs }),
  JoinCommunity: attrs => ({ type: JoinCommunity, props: attrs }),
};

/**
 * The following functions are only used internally and should not need to be
 * changed for new components.
 */

/**
 * Iterates through the non-nested children of an 'inline' node and calls
 * the traverse rendering function on each of them when necessary.
 * @param {Array} children The list of tokens
 * @return {Array} The rendered React elements
 */
// Array destructuring is not appropriate for this use case
/* eslint-disable prefer-destructuring */
function traverseChildren(children) {
  let idx = 0;
  let nesting = 0;
  const branches = [];
  while (idx < children.length) {
    const node = children[idx];
    // If nesting count is higher than 0, the traverse() function will have recursively
    // rendered the element already.
    if (nesting === 0) {
      // This rule needs to be disabled to allow mutual recursion.
      /* eslint-disable no-use-before-define */
      branches.push(traverse(children, idx));
      /* eslint-enable no-use-before-define */
    }

    if (node.type === 'html_inline') {
      if (node.content[1] === '/') nesting -= 1;
      else if (node.content.substr(-2, 1) !== '/') nesting += 1;
    } else {
      nesting += node.nesting;
    }

    idx += 1;
  }

  return branches;
}

/**
 * Renders the token at the provided index.  This will be called recursively
 * to render any simply nested children nodes of the token.
 * @param {Array} tokens The list of tokens provided by markdown-it
 * @param {Number} idx The index of the token in the above array to be rendered
 * @return {Node} The rendered React element
 */
function traverse(tokens, idx) {
  const node = tokens[idx];

  if (!node) return null;

  /* TODO: This is sub-optimal. Should generate UUID based on the actual
   * element data, most probably using md5 hash of its data */
  const key = shortid.generate();

  if (node.type === 'inline') {
    return traverseChildren(node.children);
  }

  /* Inline images need special hanling, as for markup like this:
   * ![alt text](URL)
   * `markdown-it` includs `alt text` as the child of image token. */
  if (node.type === 'image') {
    const attrs = { key };
    if (node.attrs) {
      node.attrs.forEach((attr) => {
        attrs[attr[0]] = attr[1];
      });
    }
    attrs.alt = _.get(node, 'children[0].content', '');
    return createElement('img', attrs);
  }

  if (node.type === 'html_inline') {
    const match = node.content.match(/^<(\w+) *(.*?)(\/)?>/);
    if (!match) return null;
    let type = match[1];
    const attrs = match[2] ? match[2].match(/\w+(=".*?"| ?)/g) : [];

    let props = _.fromPairs(attrs.map((attr) => {
      const pair = attr.match(/^(\w+)="(.*)"/);
      return pair ? pair.slice(1) : [attr, true];
    }));

    const selfClosing = match[3] || type === 'img' || type === 'hr' || type === 'br';

    if (customComponents[type]) {
      ({ type, props } = customComponents[type](props));
    }

    if (selfClosing) {
      return createElement(type, { key, ...props });
    }

    return createElement(type, { key, ...props }, traverse(tokens, idx + 1));
  }

  // This tag has no child elements, the recursion has hit its max depth
  if (node.nesting === 0) {
    if (node.type === 'text') {
      return node.content;
    }
    return node.content ?
      createElement(node.tag, { key, ..._.fromPairs(node.attrs) }, [node.content]) :
      createElement(node.tag, { key, ..._.fromPairs(node.attrs) });
  }

  // This tag has a directly nested tag, render it recursively.
  if (node.nesting === 1) {
    return createElement(node.tag, { key, ..._.fromPairs(node.attrs) }, traverse(tokens, idx + 1));
  }

  // This is a closing tag. Do nothing.
  return null;
}
/* eslint-enable prefer-destructuring */

const md = new MarkdownIt({ html: true });
// Disable html_block detection to force all html tags to be evaluated inline,
// this is required to parse each tag individually
md.block.ruler.disable('html_block');

// Assign the custom renderer
md.renderer.render = tokens => traverseChildren(tokens);

export default function render(text) {
  return md.render(text);
}
