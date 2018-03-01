import LoadingIndicator from 'components/LoadingIndicator';
import path from 'path';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { requireWeak, resolveWeak, SplitRoute } from 'utils/router';

export default function ExamplesRoute() {
  return (
    <SplitRoute
      cacheCss
      chunkName="examples/chunk"
      path="/examples"
      renderClientAsync={props =>
        import(/* webpackChunkName: "examples/chunk" */ './Examples')
          .then(({ default: Examples }) => <Examples {...props} />)
      }
      renderPlaceholder={() => <LoadingIndicator />}
      renderServer={(routeProps) => {
        const p = resolveWeak('./Examples');
        const Examples = requireWeak(path.join(__dirname, p));
        return (
          <StaticRouter
            context={routeProps.staticContext}
            location={routeProps.location}
          ><Examples {...routeProps} /></StaticRouter>
        );
      }}
    />
  );
}
