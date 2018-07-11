/**
 * Chunk loader for Settings
 */

import React from 'react';
import PT from 'prop-types';
import path from 'path';
import { AppChunk, webpack } from 'topcoder-react-utils';
import LoadingIndicator from 'components/LoadingIndicator';

export default function Settings({ base }) {
  return (
    <AppChunk
      chunkName="settings/chunk"
      renderClientAsync={() => import(/* webpackChunkName: "settings/chunk" */'./Router')
        .then(({ default: Router }) => <Router base={base} />)
      }
      renderPlaceholder={() => <LoadingIndicator />}
      renderServer={() => {
        const Router = webpack.requireWeak(path.resolve(__dirname, './Router'));
        return <Router base={base} />;
      }}
    />
  );
}

Settings.propTypes = {
  base: PT.string.isRequired,
};
