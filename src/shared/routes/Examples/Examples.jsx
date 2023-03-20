/**
 * Routes of various examples of using various staff
 * available in this App code.
 */

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
import Looker from 'components/examples/Looker';
import path from 'path';
import PT from 'prop-types';
import React from 'react';
import ScalableRect from 'components/examples/ScalableRect';
import SvgLoading from 'components/examples/SvgLoading';
import Tags from 'components/examples/Tags';
import Themr from 'components/examples/Themr';
import Typography from 'components/examples/Typography';
import CountdownExample from 'components/examples/CountdownExample';
import MemberTalkCloudExample from 'components/examples/MemberTalkCloudExample';
import SearchBarExample from 'components/examples/SearchBar';
import TracksTreeExample from 'components/examples/TracksTree';
import TracksFilterExample from 'components/examples/TracksFilter';
import SearchPageFilterExample from 'components/examples/SearchPageFilter';
import BlogFeedExample from 'components/examples/BlogFeed';
import GUIKit from 'components/examples/GUIKit';
import ThriveArticlesFeedExample from 'components/examples/ThriveArticlesFeed';
import GigsFeedExample from 'components/examples/GigsFeed';
import ChallengesFeed from 'components/examples/ChallengesFeed';
import MemberPathSelectorExample from 'components/examples/MemberPathSelector';

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
      <Route path={`${base}/buttons`} component={Buttons} />
      <Route path={`${base}/carousel`} component={Carousel} />
      <Route path={`${base}/countdown`} component={CountdownExample} />
      <Route path={`${base}/member-talk-cloud`} component={MemberTalkCloudExample} />
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
      <Route path={`${base}/GUIKit`} component={GUIKit} />
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
      <Route path={`${base}/looker`} component={Looker} />
      <Route path={`${base}/scalable-rect`} component={ScalableRect} />
      <Route path={`${base}/svg-loading`} component={SvgLoading} />
      <Route path={`${base}/tags`} component={Tags} />
      <Route path={`${base}/themr`} component={Themr} />
      <Route path={`${base}/typography`} component={Typography} />
      <Route path={`${base}/markdown`} component={Markdown} />
      <Route path={`${base}/search-bar`} component={SearchBarExample} />
      <Route path={`${base}/tracks-tree`} component={TracksTreeExample} />
      <Route path={`${base}/tracks-filter`} component={TracksFilterExample} />
      <Route path={`${base}/search-page-filter`} component={SearchPageFilterExample} />
      <Route path={`${base}/thrive-articles-feed`} component={ThriveArticlesFeedExample} />
      <Route path={`${base}/gigs-feed`} component={GigsFeedExample} />
      <Route path={`${base}/challenges`} component={ChallengesFeed} />
      <Route path={`${base}/blog-feed`} component={BlogFeedExample} />
      <Route path={`${base}/member-path-selector`} component={MemberPathSelectorExample} />
      <Content />
    </Switch>
  );
}

Examples.propTypes = {
  match: PT.shape({
    url: PT.string.isRequired,
  }).isRequired,
};
