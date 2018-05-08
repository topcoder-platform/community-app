import ContentfulLoader from 'containers/ContentfulLoader';
import React from 'react';

export default function Testing() {
  return (
    <ContentfulLoader
      assetQuery={{
        mimetype_group: 'plaintext'
      }}
      render={data => (
        <pre>
          {JSON.stringify(data, null, '  ')}
        </pre>
      )}
      renderPlaceholder={() => <div>test</div>}
    />
  );
}
