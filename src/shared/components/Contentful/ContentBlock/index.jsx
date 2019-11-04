/**
 * New Content Block component.
 */

import _ from 'lodash';
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
import zurichTheme from './themes/zurich.scss';
import generalTheme from './themes/general.scss';
import blobCard from './themes/blobCard.scss';
import TCO20Theme from './themes/TCO20.scss';
import largeCard from './themes/largeCard.scss';

const THEMES = {
  Default: defaultTheme,
  Veteran: veteranTheme,
  'Row Item': rowItemTheme,
  Card: cardTheme,
  TCO19: TCO19Theme,
  Zurich: zurichTheme,
  General: generalTheme,
  'Blob Card': blobCard,
  TCO20: TCO20Theme,
  'Large Card': largeCard,
};

/* Loads content block background asset. */
function ContentBlockAssetsLoader(props) {
  const {
    contentBlock, preview, spaceName, environment,
  } = props;
  const { image } = contentBlock;
  const animationId = _.get(contentBlock, 'animationOnScroll.sys.id');
  if (image || animationId) {
    const assetId = image ? image.sys.id : null;
    // eslint-disable-next-line no-unneeded-ternary
    const entryId = animationId ? animationId : null;
    return (
      <ContentfulLoader
        entryIds={entryId}
        assetIds={assetId}
        preview={preview}
        spaceName={spaceName}
        environment={environment}
        render={data => (
          <ContentBlock
            {...props}
            background={_.get(data, `assets.items.${assetId}.fields`)}
            theme={THEMES[contentBlock.baseTheme]}
            animation={_.get(data, `entries.items.${animationId}.fields`)}
          />
        )}
        renderPlaceholder={LoadingIndicator}
      />
    );
  }
  return <ContentBlock {...props} theme={THEMES[contentBlock.baseTheme]} />;
}


ContentBlockAssetsLoader.defaultProps = {
  spaceName: null,
  environment: null,
};

ContentBlockAssetsLoader.propTypes = {
  contentBlock: PT.shape().isRequired,
  id: PT.string.isRequired,
  preview: PT.bool.isRequired,
  spaceName: PT.string,
  environment: PT.string,
};

/* Loads the main content block entry. */
export default function ContentBlockLoader(props) {
  const {
    id, preview, spaceName, environment,
  } = props;
  return (
    <ContentfulLoader
      entryIds={id}
      preview={preview}
      spaceName={spaceName}
      environment={environment}
      render={data => (
        <ContentBlockAssetsLoader
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
  spaceName: null,
  environment: null,
};

ContentBlockLoader.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
};
