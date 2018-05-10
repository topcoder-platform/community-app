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
      renderClientAsync={() =>
        import(/* webpackChunkName: "profile/chunk" */ 'containers/Settings/SettingsProfile')
          .then(({ default: SettingsProfileContainer }) => (
            <SettingsProfileContainer {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
      renderServer={() => {
        const p = webpack.resolveWeak('containers/Settings/SettingsProfile');
        const SettingsProfileContainer =
          webpack.requireWeak(path.resolve(__dirname, p));
        return <SettingsProfileContainer {...props} />;
      }}
    />
  );
}
