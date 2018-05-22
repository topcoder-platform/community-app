/**
 * New Content Block component.
 */

import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import ContentBlock from './ContentBlock';

/* eslint-disable global-require */
const THEMES = {
  Veteran: require('./themes/default_veteran.scss'),
};
/* eslint-enable global-require */

/* Loads content block background asset. */
function BackgroundLoader(props) {
  const { contentBlock, preview } = props;
  if (!contentBlock.backgroundImage) {
    return (
      <ContentfulLoader
        preview={preview}
        render={data => (
          <ContentBlock
            {...props}
            theme={THEMES[contentBlock.baseTheme]}
          />
        )}
        renderPlaceholder={LoadingIndicator}
      />
    );
  } else {
    const assetId = contentBlock.backgroundImage.sys.id;
    return (
      <ContentfulLoader
        assetIds={assetId}
        preview={preview}
        render={data => (
          <ContentBlock
            {...props}
            background={data.assets.items[assetId].fields}
            theme={THEMES[contentBlock.baseTheme]}
          />
        )}
        renderPlaceholder={LoadingIndicator}
      />
    );
  }
}

BackgroundLoader.propTypes = {
  contentBlock: PT.shape().isRequired,
  id: PT.string.isRequired,
  preview: PT.bool.isRequired,
};

/* Loads the main content block entry. */
export default function ContentBlockLoader(props) {
  const { id, preview } = props;
  return (
    <ContentfulLoader
      entryIds={id}
      preview={preview}
      render={data => (
        <BackgroundLoader
          {...props}
          contentBlock={data.entries.items[id].fields}
        />
      )}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ContentBlockLoader.defaultProps = {
  preview: false,
};

ContentBlockLoader.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
};
