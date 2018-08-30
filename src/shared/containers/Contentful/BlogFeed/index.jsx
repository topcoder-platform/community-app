/**
 * BlogFeed loader.
 * It loads data from CMS based on id & preview and pass to
 * BlogFeed container.
 */

import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import BlogFeed from './BlogFeed';

export default function BlogFeedLoader({ id, preview }) {
  return (
    <ContentfulLoader
      entryIds={id}
      preview={preview}
      render={data => (
        <BlogFeed
          blogFeed={data.entries.items[id]}
        />
      )}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

BlogFeedLoader.defaultProps = {
  preview: false,
};

BlogFeedLoader.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
};
