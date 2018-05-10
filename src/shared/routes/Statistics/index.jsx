import LoadingIndicator from 'components/LoadingIndicator';
import path from 'path';
import React from 'react';
import { AppChunk, webpack } from 'topcoder-react-utils';

export default function StatisticsRoute() {
  return (
    <AppChunk
      chunkName="examples/chunk"
      path="/members/:handle([\w\-\[\].{}]{2,15})/details"
      renderClientAsync={props =>
        import(/* webpackChunkName: "examples/chunk" */ './Statistics')
          .then(({ default: Statistics }) => <Statistics {...props} />)
      }
      renderPlaceholder={() => <LoadingIndicator />}
      renderServer={(routeProps) => {
        const Statistics =
          webpack.requireWeak(path.join(__dirname, './Statistics'));
        return <Statistics {...routeProps} />;
      }}
    />
  );
}
