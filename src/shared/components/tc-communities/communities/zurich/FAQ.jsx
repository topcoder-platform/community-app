/**
 * Static implementation of Learn page for Wipro 2 community
 *
 * It hardcodes data which is passed to dummy components,
 * thus we disable max-len eslint rule for this file
 */
/* eslint-disable max-len */

import React from 'react';
import Viewport from 'components/Contentful/Viewport';

export default function Learn() {
  return (
    <Viewport
      query={{
        'fields.name': 'Zurich Community - FAQ',
      }}
    />
  );
}
