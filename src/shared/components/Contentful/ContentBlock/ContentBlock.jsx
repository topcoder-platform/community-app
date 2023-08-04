/**
 * The core content block rendering.
 */

import PT from 'prop-types';
import React from 'react';

import MarkdownRenderer from 'components/MarkdownRenderer';
import { themr } from 'react-css-super-themr';
import { fixStyle } from 'utils/contentful';
import { isomorphy } from 'topcoder-react-utils';
import { ContentfulLivePreview } from '@contentful/live-preview';

// AOS
import AOS from 'aos';

import defaultTheme from './themes/default.scss';

function ContentBlock({
  id,
  background,
  contentBlock,
  theme,
  spaceName,
  environment,
  preview,
  animation,
}) {
  const contentfulConfig = {
    spaceName,
    environment,
    preview,
  };
  const innerContent = (
    <div
      className={theme.contentWrapper}
      style={fixStyle(contentBlock.extraStylesForContentWrapper)}
    >
      {
        background ? (
          <div className={theme.image}>
            <img alt={contentBlock.alt || contentBlock.name} src={background.file.url} />
          </div>
        ) : null
      }
      <div
        className={theme.content}
        style={fixStyle(contentBlock.extraStylesForContent)}
        {...ContentfulLivePreview.getProps({ entryId: id, fieldId: 'text' })}
      >
        <MarkdownRenderer markdown={contentBlock.text} {...contentfulConfig} />
      </div>
    </div>
  );
  if (animation.animateOnScroll) {
    // Animations only on client side
    if (isomorphy.isClientSide()) {
      AOS.init();
    }
    return (
      <div
        id={id}
        className={theme.container}
        style={fixStyle(contentBlock.extraStylesForContainer)}
        data-aos={animation.animateOnScroll}
        data-aos-once={animation.animateOnScrollOnce}
        data-aos-delay={animation.animateOnScrollDelay}
        data-aos-duration={animation.animateOnScrollDuration}
        data-aos-easing={animation.animateOnScrollEasing}
        data-aos-mirror={animation.animateOnScrollMirror}
        data-aos-anchor-placement={animation.animateOnScrollAnchor}
        data-aos-offset={animation.animateOnScrollOffset}
      >
        {innerContent}
      </div>
    );
  }
  return (
    <div
      id={id}
      className={theme.container}
      style={fixStyle(contentBlock.extraStylesForContainer)}
    >
      {innerContent}
    </div>
  );
}

ContentBlock.defaultProps = {
  background: null,
  preview: false,
  spaceName: null,
  environment: null,
  animation: {},
};

ContentBlock.propTypes = {
  id: PT.string.isRequired,
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
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
  animation: PT.shape(),
};

export default themr('ContentBlock', defaultTheme)(ContentBlock);
