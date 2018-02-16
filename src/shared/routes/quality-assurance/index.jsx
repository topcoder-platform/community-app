
import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import { SplitRoute } from 'utils/router';

export default function QualityAssurance() {
  return (
    <SplitRoute
      cacheCss
      chunkName="quality-assurance/chunk"
      renderClientAsync={renderProps =>
        import(
          /* webpackChunkName: "quality-assurance/chunk" */
          'containers/quality-assurance',
        ).then(({ default: QualityAssuranceListing }) =>
          <QualityAssuranceListing {...renderProps} />,
        )
      }
      renderPlaceholder={() => <LoadingIndicator />}
    />
  );
}
