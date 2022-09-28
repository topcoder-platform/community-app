/**
 * Chunk loader for Timeline wall
 */

import React from 'react';
import path from 'path';
import { AppChunk, webpack } from 'topcoder-react-utils';
import LoadingIndicator from 'components/LoadingIndicator';

export default function TimelineWall() {
  return (
    <AppChunk
      chunkName="timeline-wall/chunk"
      renderClientAsync={() => import(/* webpackChunkName: "timeline-wall/chunk" */'./Router')
        .then(({ default: Router }) => <Router />)
      }
      renderPlaceholder={() => <LoadingIndicator />}
      renderServer={() => {
        const Router = webpack.requireWeak(path.resolve(__dirname, './Router'));
        return <Router />;
      }}
    />
  );
}
