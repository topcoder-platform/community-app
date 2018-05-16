/**
 * The loader of Settings webpack chunks.
 */
import path from 'path';
import React from 'react';
import { StaticRouter } from 'react-router-dom';

import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import { requireWeak, resolveWeak, SplitRoute } from 'utils/router';

export default function SettingsLoader(props) {
  return (
    <SplitRoute
      cacheCss
      chunkName="settings/chunk"
      renderClientAsync={() =>
        import(/* webpackChunkName: "settings/chunk" */ 'containers/Settings')
          .then(({ default: SettingsContainer }) => (
            <SettingsContainer {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
      renderServer={() => {
        const p = resolveWeak('containers/Settings');
        const SettingsContainer = requireWeak(path.resolve(__dirname, p));
        return (
          <StaticRouter context={{}}>
            <SettingsContainer {...props} />
          </StaticRouter>
        );
      }}
    />
  );
}
