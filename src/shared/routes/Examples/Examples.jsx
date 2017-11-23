/**
 * Routes of various examples of using various staff
 * available in this App code.
 */

import Buttons from 'components/examples/Buttons';
import Content from 'components/Content';
import CssModules from 'components/examples/CssModules';
import ErrorMessage from 'components/examples/ErrorMessage';
import FontsTest from 'components/examples/FontsTest';
import LinkTest from 'components/examples/LinkTest';
import LoadingIndicator from 'components/LoadingIndicator';
import LoadingIndicators from 'components/examples/LoadingIndicators';
import path from 'path';
import PT from 'prop-types';
import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import SvgLoading from 'components/examples/SvgLoading';
import Tags from 'components/examples/Tags';
import Themr from 'components/examples/Themr';
import Typography from 'components/examples/Typography';

import { requireWeak, resolveWeak, SplitRoute } from 'utils/router';

import DataFetch from './DataFetch';

export default function Examples(props) {
  const base = props.match.url;
  return (
    <Switch>
      <Route path={`${base}/buttons`} component={Buttons} />
      <SplitRoute
        cacheCss
        chunkName="code-splitting/chunk"
        path={`${base}/code-splitting`}
        renderClientAsync={() =>
          import(
            /* webpackChunkName: "code-splitting/chunk" */
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
      <Route
        component={() => <ErrorMessage />}
        path={`${base}/error-message`}
      />
      <Route
        component={LinkTest}
        path={`${base}/link-test`}
      />
      <Route
        component={LoadingIndicators}
        path={`${base}/loading-indicators`}
      />
      <Route path={`${base}/svg-loading`} component={SvgLoading} />
      <Route path={`${base}/tags`} component={Tags} />
      <Route path={`${base}/themr`} component={Themr} />
      <Route path={`${base}/typography`} component={Typography} />
      <Content />
    </Switch>
  );
}

Examples.propTypes = {
  match: PT.shape({
    url: PT.string.isRequired,
  }).isRequired,
};
