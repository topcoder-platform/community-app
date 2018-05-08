import ContentfulLoader from 'containers/ContentfulLoader';
import React from 'react';

export default function Testing() {
  return (
    <ContentfulLoader
      assetQuery
      render={() => <div>Content</div>}
      renderPlaceholder={() => <div>test</div>}
    />
  );
}
