/**
 * The Sandbox is a place to put any experimental, proof-of-concept routes,
 * that will be moved to proper places (probably, outside of the app) later.
 */

import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import { SplitRoute } from 'utils/router';

export default function Sandbox({ base }) {
  return (
    <SplitRoute
      chunkName="sandbox"
      renderClientAsync={() =>
        import(
          /* webpackChunkName: "sandbox" */
          './Router',
        ).then(({ default: Router }) => <Router base={base} />)
      }
      renderPlaceholder={() => <LoadingIndicator />}
    />
  );
}

Sandbox.propTypes = {
  base: PT.string.isRequired,
};
