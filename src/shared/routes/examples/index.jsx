/**
 * Routes of various examples of using various staff
 * available in this App code.
 */

import Buttons from 'components/examples/Buttons';
import CssModules from 'components/examples/CssModules';
import FontsTest from 'components/examples/FontsTest';
import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import SvgLoading from 'components/examples/SvgLoading';
import Themr from 'components/examples/Themr';

import { requireWeak, SplitRoute } from 'utils/router';

import DataFetch from './DataFetch';

export default function Examples() {
  return (
    <Switch>
      <Route path="*/buttons" component={Buttons} />
      <SplitRoute
        id="code-splitting-test"
        path="*/code-splitting"
        renderClientAsync={() =>
          import('components/examples/CodeSplitting')
            .then(({ default: CodeSplitting }) => <CodeSplitting />)
        }
        renderPlaceholder={() => <LoadingIndicator />}
        renderServer={() => {
          const CodeSplitting
            = requireWeak('components/examples/CodeSplitting');
          return <CodeSplitting />;
        }}
      />
      <Route path="*/css-modules" component={CssModules} />
      <Route path="*/data-fetch" component={DataFetch} />
      <Route path="*/fonts-test" component={FontsTest} />
      <Route path="*/svg-loading" component={SvgLoading} />
      <Route path="*/themr" component={Themr} />
    </Switch>
  );
}
