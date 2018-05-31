/**
 * The Sandbox is a place to put any experimental, proof-of-concept routes,
 * that will be moved to proper places (probably, outside of the app) later.
 */

import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import { AppChunk } from 'topcoder-react-utils';

export default function Sandbox({ base }) {
  return (
    <AppChunk
      chunkName="sandbox/chunk"
      renderClientAsync={() =>
        import(/* webpackChunkName: "sandbox/chunk" */ './Router')
        .then(({ default: Router }) => <Router base={base} />)
      }
      renderPlaceholder={() => <LoadingIndicator />}
    />
  );
}

Sandbox.propTypes = {
  base: PT.string.isRequired,
};
