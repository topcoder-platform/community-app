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
          /* eslint-disable react/no-danger */
          dangerouslySetInnerHTML={{ __html: md(contentBlock.text || '') }}
          /* eslint-enable react/no-danger */
          style={contentBlock.extraStylesForContent}
        />
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
