/**
 * The core content block rendering.
 */

import md from 'utils/markdown';
import PT from 'prop-types';
import React from 'react';

import { themr } from 'react-css-super-themr';
import defaultTheme from './themes/default.scss';

function ContentBlock({
  background,
  contentBlock,
  theme,
}) {
  if (background) {
    return (
      <div
        className={theme.container}
        style={contentBlock.containerStyles}
      >
        <div className={theme.containerWrapperByImage} style={contentBlock.contentWrapperStyles}>
          <div
            className={theme.contentByImage}
            /* eslint-disable react/no-danger */
            dangerouslySetInnerHTML={{ __html: md(contentBlock.text) }}
            /* eslint-enable react/no-danger */
            style={contentBlock.contentStyles}
          />
          <div className={theme.image} style={{ backgroundImage: `url(${background.file.url})` }} />
        </div>
      </div>
    );
  }
  return (
    <div
      className={theme.container}
      style={contentBlock.containerStyles}
    >
      <div className={theme.contentWrapper} style={contentBlock.contentWrapperStyles}>
        <div
          className={theme.content}
          /* eslint-disable react/no-danger */
          dangerouslySetInnerHTML={{ __html: md(contentBlock.text) }}
          /* eslint-enable react/no-danger */
          style={contentBlock.contentStyles}
        />
      </div>
    </div>
  );
}

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
