/**
 * Routes of various examples of using various staff
 * available in this App code.
 */

import Buttons from 'components/examples/Buttons';
import Content from 'components/Content';
import CssModules from 'components/examples/CssModules';
import FontsTest from 'components/examples/FontsTest';
import LoadingIndicator from 'components/LoadingIndicator';
import path from 'path';
import PT from 'prop-types';
import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import SvgLoading from 'components/examples/SvgLoading';
import Themr from 'components/examples/Themr';

import { requireWeak, resolveWeak, SplitRoute } from 'utils/router';

import DataFetch from './DataFetch';

export default function Examples(props) {
  const base = props.match.url;
  return (
    <Switch>
      <Route path={`${base}/buttons`} component={Buttons} />
      <SplitRoute
        cacheCss
        chunkName="code-splitting"
        path={`${base}/code-splitting`}
        renderClientAsync={() =>
          import(
            /* webpackChunkName: "code-splitting" */
            'components/examples/CodeSplitting',
          ).then(({ default: CodeSplitting }) => <CodeSplitting />)
        }
        renderPlaceholder={() => <LoadingIndicator />}
        renderServer={() => {
          const p = resolveWeak('components/examples/CodeSplitting');
          const CodeSplitting = requireWeak(path.resolve(__dirname, p));
          return <CodeSplitting />;
        }}
      />
      <Route path={`${base}/css-modules`} component={CssModules} />
      <Route path={`${base}/data-fetch`} component={DataFetch} />
      <Route path={`${base}/fonts-test`} component={FontsTest} />
      <Route path={`${base}/svg-loading`} component={SvgLoading} />
      <Route path={`${base}/themr`} component={Themr} />
      <Content />
    </Switch>
  );
}

Examples.propTypes = {
  match: PT.shape({
    url: PT.string.isRequired,
  }).isRequired,
};
