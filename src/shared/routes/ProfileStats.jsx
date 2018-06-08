/**
 * The loader of Profile webpack chunks.
 */
import React from 'react';

import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import { AppChunk } from 'topcoder-react-utils';

export default function ProfileStatsRoute(props) {
  return (
    <AppChunk
      chunkName="profileStats/chunk"
      renderClientAsync={() =>
        import(/* webpackChunkName: "profileStats/chunk" */ 'containers/ProfileStats')
          .then(({ default: ProfileStatsContainer }) => (
            <ProfileStatsContainer {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
    />
  );
}
