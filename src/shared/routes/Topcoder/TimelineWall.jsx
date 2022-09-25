/**
 * The loader of Timeline Wall Page code chunks.
 */

import React from 'react';

import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import { AppChunk } from 'topcoder-react-utils';

export default function TimelineWallRoute(props) {
  return (
    <AppChunk
      chunkName="timelineWall/chunk"
      renderClientAsync={() => import(/* webpackChunkName: "timelineWall/chunk" */ 'containers/TimelineWall')
        .then(({ default: TimelineWall }) => (
          <TimelineWall {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
    />
  );
}
