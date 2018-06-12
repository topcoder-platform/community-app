/**
 * Static implementation of Home page for a community
 */

import Viewport from 'components/Contentful/Viewport';
import React from 'react';

export default function Home() {
  return (
    <Viewport
      query={{
        'fields.name': 'Community 2 - Home Page',
      }}
    />
  );
}
