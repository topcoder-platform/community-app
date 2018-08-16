/**
 * Routes of various examples of using various staff
 * available in this App code.
 */

import Announcement from 'components/examples/Announcement';
import Buttons from 'components/examples/Buttons';
import Carousel from 'components/examples/Carousel';
import ColorMixins from 'components/examples/ColorMixins';
import Content from 'components/Content';
import CssModules from 'components/examples/CssModules';
import Editor from 'components/examples/Editor';
import ErrorMessage from 'components/examples/ErrorMessage';
import FontsTest from 'components/examples/FontsTest';
import LinkTest from 'components/examples/LinkTest';
import LoadingIndicator from 'components/LoadingIndicator';
import LoadingIndicators from 'components/examples/LoadingIndicators';
import Markdown from 'components/examples/Markdown';
import path from 'path';
import PT from 'prop-types';
import React from 'react';
import ScalableRect from 'components/examples/ScalableRect';
import SvgLoading from 'components/examples/SvgLoading';
import Tags from 'components/examples/Tags';
import Themr from 'components/examples/Themr';
import Typography from 'components/examples/Typography';
import CountdownExample from 'components/examples/CountdownExample';

import {
  Switch,
  Route,
} from 'react-router-dom';
import { AppChunk, webpack } from 'topcoder-react-utils';

import Contentful from './Contentful';
import DataFetch from './DataFetch';

export default function Examples({
  match: {
    url: base,
  },
}) {
  return (
    <Switch>
      <Route path={`${base}/announcement/:id`} component={Announcement} />
      <Route path={`${base}/buttons`} component={Buttons} />
      <Route path={`${base}/carousel`} component={Carousel} />
      <Route path={`${base}/countdown`} component={CountdownExample} />
      <AppChunk
        chunkName="code-splitting/chunk"
        path={`${base}/code-splitting`}
        renderClientAsync={() => import(/* webpackChunkName: "code-splitting/chunk" */ 'components/examples/CodeSplitting')
          .then(({ default: CodeSplitting }) => <CodeSplitting />)
        }
        renderPlaceholder={() => <LoadingIndicator />}
        renderServer={() => {
          const p = webpack.resolveWeak('components/examples/CodeSplitting');
          const CodeSplitting = webpack.requireWeak(path.resolve(__dirname, p));
          return <CodeSplitting />;
        }}
      />
      <Route path={`${base}/color-mixins`} component={ColorMixins} />
      <Route path={`${base}/contentful`} component={Contentful} />
      <Route path={`${base}/css-modules`} component={CssModules} />
      <Route path={`${base}/data-fetch`} component={DataFetch} />
      <Route path={`${base}/editor`} component={Editor} />
      <Route
        component={() => <ErrorMessage />}
        path={`${base}/error-message`}
      />
      <Route path={`${base}/fonts-test`} component={FontsTest} />
      <Route
        component={LinkTest}
        path={`${base}/link-test`}
      />
      <Route
        component={LoadingIndicators}
        path={`${base}/loading-indicators`}
      />
      <Route path={`${base}/markdown`} component={Markdown} />
      <Route path={`${base}/scalable-rect`} component={ScalableRect} />
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
