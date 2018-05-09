import ContentfulLoader from 'containers/ContentfulLoader';
import React from 'react';

export default function Testing() {
  return (
    <ContentfulLoader
      assetIds={['29ysEKdf1i8KWWgIeqIqwy', '5LbjvbQVd68A0GAykeYue0']}
      render={data => (
        <pre>
          {JSON.stringify(data, null, '  ')}
        </pre>
      )}
      renderPlaceholder={() => <div>test</div>}
    />
  );
}
