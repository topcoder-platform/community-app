import LoadingIndicator from 'components/LoadingIndicator';
import path from 'path';
import React from 'react';
import { AppChunk, webpack } from 'topcoder-react-utils';

export default function ExamplesRoute() {
  return (
    <AppChunk
      chunkName="examples/chunk"
      path="/examples"
      renderClientAsync={props =>
        import(/* webpackChunkName: "examples/chunk" */ './Examples')
          .then(({ default: Examples }) => <Examples {...props} />)
      }
      renderPlaceholder={() => <LoadingIndicator />}
      renderServer={(routeProps) => {
        const Examples =
          webpack.requireWeak(path.join(__dirname, './Examples'));
        return <Examples {...routeProps} />;
      }}
    />
  );
}
