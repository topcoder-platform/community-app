/**
 * Renders markdown into native React components.
 * In most cases the <MarkdownRenderer> component should be utilized instead of
 * using this directly.
 *
 * Additional custom components can be added to the customComponents array found below.
 */

import _ from 'lodash';
import React from 'react';
import MarkdownIt from 'markdown-it';
import { Button, PrimaryButton, SecondaryButton } from 'topcoder-react-ui-kit';
import { Link } from 'topcoder-react-utils';

import JoinCommunity from 'containers/tc-communities/JoinCommunity';
import VideoModalButton from 'components/VideoModalButton';

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
  VideoModalButton: attrs => ({ type: VideoModalButton, props: attrs }),
};

/**
 * The following functions are only used internally and should not need to be
 * changed for new components.
 */

function normalizeProps(props) {
  if (!props.style) return props;
  const res = _.clone(props);
  res.style = {};
  props.style.split(';').forEach((style) => {
    const [name, value] = style.split(':');
    res.style[_.camelCase(name)] = value;
  });
  return res;
}

/**
 * Maps token into properties for corresponding ReactJS component.
 * @param {Object} token
 * @param {Number} key
 * @return {Object}
 */
function getProps(token, key) {
  const res = { key };
  if (token.attrs) {
    token.attrs.forEach(([attr, value]) => {
      res[attr] = value;
    });
  }
  return normalizeProps(res);
}

/**
 * Renders tokens with zero nesting.
 * @param {Object} tokens
 * @param {Number} index
 * @return {Object}
 */
function renderToken(tokens, index) {
  const token = tokens[index];
  switch (token.type) {
    case 'image': {
      const props = getProps(token, index);
      props.alt = _.get(token, 'children[0].content', '');
      return React.createElement('img', props);
    }
    case 'inline':
      /* eslint-disable no-use-before-define */
      return renderTokens(token.children, 0);
      /* eslint-enable no-use-before-define */
    case 'text':
      return token.content;
    default:
      return React.createElement(
        token.tag,
        getProps(token, index),
        token.content || undefined,
      );
  }
}

/**
 * Iterates through the non-nested children of an 'inline' node and calls
 * the traverse rendering function on each of them when necessary.
 * @param {Array} tokens The list of tokens
 * @param {Number} startFrom Starting index for the rendering pass.
 * @return {Array} The rendered React elements
 */
// Array destructuring is not appropriate for this use case
/* eslint-disable prefer-destructuring */
function renderTokens(tokens, startFrom) {
  let level = 0;
  const output = [];
  for (let pos = startFrom; pos < tokens.length; pos += 1) {
    const token = tokens[pos];
    const content = token.content;
    const html = token.type === 'html_inline';
    if (token.nesting === -1 || (html && content.startsWith('</'))) {
      level -= 1;
    } else if (level === 0) {
      if (token.nesting === 1) {
        output.push(React.createElement(
          token.tag,
          getProps(token, pos),
          renderTokens(tokens, 1 + pos),
        ));
        level += 1;
      } else if (token.type === 'html_inline') {
        if (!token.content.startsWith('</')) {
          const match = token.content.match(/^<(\w+) *(.*?)(\/)?>/);
          let tag = match[1];
          const attrs = match[2] ? match[2].match(/\w+(=".*?"| ?)/g) : [];
          let props = _.fromPairs(attrs.map((attr) => {
            const pair = attr.match(/^(\w+)="(.*)"/);
            return pair ? pair.slice(1) : [attr, true];
          }));
          const selfClosing = match[3] || tag === 'img' || tag === 'hr' || tag === 'br';
          if (customComponents[tag]) {
            ({ type: tag, props } = customComponents[tag](props));
          }
          props = normalizeProps(props);
          if (selfClosing) {
            output.push(React.createElement(tag, { key: pos, ...props }));
          } else {
            level += 1;
            output.push(React.createElement(
              tag,
              { key: pos, ...props },
              renderTokens(tokens, pos + 1),
            ));
          }
        }
      } else output.push(renderToken(tokens, pos));
    } else if (token.nesting === 1) {
      level += 1;
    } else if (html) {
      if (!content.startsWith('</') && !content.endsWith('/>')) {
        level += 1;
      }
    }
    if (level < 0) break;
  }
  return output;
}

const md = new MarkdownIt({ html: true });
// Disable html_block detection to force all html tags to be evaluated inline,
// this is required to parse each tag individually
md.block.ruler.disable('html_block');

// Assign the custom renderer
md.renderer.render = tokens => renderTokens(tokens, 0);

export default function render(text) {
  return md.render(text);
}
