/**
 * Static implementation of Home page for a community
 */

import ContentfulLoader from 'containers/ContentfulLoader';
import ContentfulViewport from 'components/Contentful/Viewport';
import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';

export default function Home() {
  return (
    <ContentfulLoader
      entryQueries={{
        content_type: 'viewport',
        'fields.name': 'Community 2 - Home Page',
      }}
      render={(d) => {
        const { items } = d.entries.matches[0];
        return items.length ? <ContentfulViewport id={items[0]} /> : null;
      }}
      renderPlaceholder={LoadingIndicator}
    />
  );
}
