import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import Viewport from 'components/Contentful/Viewport';

export default function Home() {
  return (
    <ContentfulLoader
      entryQueries={{
        content_type: 'viewport',
        'fields.name': 'CS Community - Home',
      }}
      render={data => (
        <Viewport
          id={data.entries.matches[0].items[0]}
        />
      )}
      renderPlaceholder={LoadingIndicator}
    />
  );
}
