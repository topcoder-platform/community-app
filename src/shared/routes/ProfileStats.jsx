/**
 * The loader of Profile webpack chunks.
 */
import path from 'path';
import React from 'react';

import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import { AppChunk, webpack } from 'topcoder-react-utils';

export default function ProfileStatsRoute(props) {
  return (
    <AppChunk
      chunkName="profileStats/chunk"
      renderClientAsync={() => import(/* webpackChunkName: "profileStats/chunk" */ 'containers/ProfileStats')
        .then(({ default: ProfileStatsContainer }) => (
          <ProfileStatsContainer {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
      renderServer={() => {
        const p = webpack.resolveWeak('containers/ProfileStats');
        const ProfileStatsContainer = webpack.requireWeak(path.resolve(__dirname, p));
        return <ProfileStatsContainer {...props} />;
      }}
    />
  );
}
