/**
 * The loader of Profile webpack chunks.
 */
import path from 'path';
import React from 'react';

import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import { AppChunk, webpack } from 'topcoder-react-utils';

export default function ProfileLoader(props) {
  return (
    <AppChunk
      chunkName="profile/chunk"
      renderClientAsync={() => import(/* webpackChunkName: "profile/chunk" */ 'containers/Profile')
        .then(({ default: ProfileContainer }) => (
          <ProfileContainer {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
      renderServer={() => {
        const p = webpack.resolveWeak('containers/Profile');
        const ProfileContainer = webpack.requireWeak(path.resolve(__dirname, p));
        return <ProfileContainer {...props} />;
      }}
    />
  );
}
