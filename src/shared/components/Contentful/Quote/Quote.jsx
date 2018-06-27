/**
 * The core Quote rendering.
 */

import PT from 'prop-types';
import React from 'react';

import MarkdownRenderer from 'components/MarkdownRenderer';

import { themr } from 'react-css-super-themr';

function Quote({
  avatar,
  quote,
  theme,
}) {
  return (
    <div>
      <div
        className={theme.container}
        style={quote.extraStylesForContainer}
      >
        <div
          className={theme.contentWrapper}
          style={quote.extraStylesForContentWrapper}
        >
          <div className={`${theme.avatarContainer} ${(avatar ? '' : theme.noImage)}`}>
            { avatar ? <img alt="Quote author avatar" src={avatar.file.url} /> : null }
            <div className={theme.authorInfo}>
              <span className={theme.authorName}>
                {quote.authorName}
&nbsp;
              </span>
              <span className={theme.authorAffiliation}>
                {quote.authorAffiliation}
              </span>
            </div>
          </div>
          <div
            className={theme.content}
            style={quote.extraStylesForContent}
          >
            <div className={theme.quoteTextWrapper}>
              <MarkdownRenderer markdown={quote.text} />
            </div>
            <div className={theme.authorInfo}>
              <span className={theme.authorName}>
                {quote.authorName}
&nbsp;
              </span>
              <span className={theme.authorAffiliation}>
                {quote.authorAffiliation}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Quote.defaultProps = {
  avatar: null,
};

Quote.propTypes = {
  avatar: PT.shape(),
  quote: PT.shape().isRequired,
  theme: PT.shape({
    container: PT.string.isRequired,
    contentWrapper: PT.string.isRequired,
    content: PT.string.isRequired,
    quoteTextWrapper: PT.string.isRequired,
    authorInfo: PT.string.isRequired,
    authorName: PT.string.isRequired,
    authorAffiliation: PT.string.isRequired,
    avatarContainer: PT.string.isRequired,
  }).isRequired,
};

export default themr('Quote')(Quote);
