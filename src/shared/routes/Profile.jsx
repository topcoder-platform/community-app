/**
 * The loader of Profile webpack chunks.
 */
import path from 'path';
import React from 'react';
import { StaticRouter } from 'react-router-dom';

import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import { requireWeak, resolveWeak, SplitRoute } from 'utils/router';

export default function ProfileLoader(props) {
  return (
    <SplitRoute
      cacheCss
      chunkName="profile/chunk"
      renderClientAsync={() =>
        import(/* webpackChunkName: "profile/chunk" */ 'containers/Profile')
          .then(({ default: ProfileContainer }) => (
            <ProfileContainer {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
      renderServer={() => {
        const p = resolveWeak('containers/Profile');
        const ProfileContainer = requireWeak(path.resolve(__dirname, p));
        return (
          <StaticRouter context={{}}>
            <ProfileContainer {...props} />
          </StaticRouter>
        );
      }}
    />
  );
}
