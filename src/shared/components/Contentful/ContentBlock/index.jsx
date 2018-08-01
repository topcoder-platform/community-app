/**
 * New Content Block component.
 */

import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import ContentBlock from './ContentBlock';

import defaultTheme from './themes/default.scss';
import veteranTheme from './themes/default_veteran.scss';
import rowItemTheme from './themes/row_item.scss';
import cardTheme from './themes/card.scss';
import TCO19Theme from './themes/TCO19.scss';

const THEMES = {
  Default: defaultTheme,
  Veteran: veteranTheme,
  'Row Item': rowItemTheme,
  Card: cardTheme,
  TCO19: TCO19Theme,
};

/* Loads content block background asset. */
function BackgroundLoader(props) {
  const { contentBlock, preview } = props;
  const { image } = contentBlock;
  if (image) {
    const assetId = image.sys.id;
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
  return <ContentBlock {...props} theme={THEMES[contentBlock.baseTheme]} />;
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
