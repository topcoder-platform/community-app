import React from 'react';
import Viewport from 'components/Contentful/Viewport';

export default function Catalog() {
  return (
    <Viewport
      query={{
        'fields.name': 'CS Community - Catalog',
      }}
    />
  );
}
