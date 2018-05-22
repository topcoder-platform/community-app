/**
 * New viewport component.
 */

import _ from 'lodash';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import ContentfullBanner from 'components/Contentful/Banner';
import ContentfullBlock from 'components/Contentful/ContentBlock';
import { fireErrorMessage } from 'utils/errors';
import PT from 'prop-types';
import React from 'react';

/* Loads viewport background asset. */
function BackgroundLoader(props) {
  const { viewport, preview } = props;
  const contents = viewport.content;
  const viewportItemsIds = _.map(contents, 'sys.id');
  return (
    <ContentfulLoader
      entryIds={viewportItemsIds}
      preivew={preview}
      render={(data) => {
          return viewportItemsIds.map((viewportItem, idx) => {
            if (data.entries.items[viewportItemsIds[idx]].sys.contentType.sys.id === 'banner') {
             return <ContentfullBanner id={viewportItemsIds[idx]} />;
            } else if (data.entries.items[viewportItemsIds[idx]].sys.contentType.sys.id === 'contentBlock') {
             return <ContentfullBlock id={viewportItemsIds[idx]} />;
            } else {
              fireErrorMessage('Unsupported content type from contentful', '');
              return;
            }
          });
        }
      }
      renderPlaceholder={LoadingIndicator}
    />
  );
}

BackgroundLoader.propTypes = {
  viewport: PT.shape().isRequired,
  id: PT.string.isRequired,
  preview: PT.bool.isRequired,
};

/* Loads the main viewport entry. */
export default function ViewportLoader(props) {
  const { id, preview } = props;
  return (
    <ContentfulLoader
      entryIds={id}
      preview={preview}
      render={data => (
        <BackgroundLoader
          {...props}
          viewport={data.entries.items[id].fields}
        />
      )}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ViewportLoader.defaultProps = {
  preview: false,
};

ViewportLoader.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
};
