/**
 * The core content block rendering.
 */

import PT from 'prop-types';
import React from 'react';

import MarkdownRenderer from 'components/MarkdownRenderer';

import { themr } from 'react-css-super-themr';
import defaultTheme from './themes/default.scss';

function ContentBlock({
  background,
  contentBlock,
  theme,
}) {
  return (
    <div
      className={theme.container}
      style={contentBlock.extraStylesForContainer}
    >
      <div
        className={theme.contentWrapper}
        style={contentBlock.extraStylesForContentWrapper}
      >
        {
          background ? (
            <div className={theme.image}>
              <img alt="" src={background.file.url} />
            </div>
          ) : null
        }
        <div
          className={theme.content}
          style={contentBlock.extraStylesForContent}
        >
          <MarkdownRenderer markdown={contentBlock.text} />
        </div>
      </div>
    </div>
  );
}

ContentBlock.defaultProps = {
  background: null,
};

ContentBlock.propTypes = {
  background: PT.shape(),
  contentBlock: PT.shape().isRequired,
  theme: PT.shape({
    container: PT.string.isRequired,
    content: PT.string.isRequired,
    contentWrapper: PT.string.isRequired,
    contentByImage: PT.string,
    contentWrapperByImage: PT.string,
    image: PT.string,
  }).isRequired,
};

export default themr('ContentBlock', defaultTheme)(ContentBlock);
