import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import Viewport from 'components/Contentful/Viewport';

export default function MemberProgramsPage() {
  return (
    <ContentfulLoader
      entryQueries={{
        content_type: 'viewport',
        'fields.name': 'Member Programs',
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
