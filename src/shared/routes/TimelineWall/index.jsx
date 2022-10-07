/**
 * Chunk loader for Timeline wall
 */

import React from 'react';
import { AppChunk } from 'topcoder-react-utils';
import LoadingIndicator from 'components/LoadingIndicator';

export default function TimelineWall(props) {
  return (
    <AppChunk
      chunkName="timeline-wall/chunk"
      renderClientAsync={() => import(/* webpackChunkName: "timeline-wall/chunk" */'./Router')
        .then(({ default: Router }) => <Router {...props} />)
      }
      exact
      renderPlaceholder={() => <LoadingIndicator />}
    />
  );
}
