/**
 * New viewport component.
 */

import _ from 'lodash';
import Accordion from 'components/Contentful/Accordion';
import Banner from 'components/Contentful/Banner';
import ChallengesBlock from 'containers/Contentful/ChallengesBlock';
import ContentBlock from 'components/Contentful/ContentBlock';
import BlogPost from 'components/Contentful/BlogPost';
import ContentfulLoader from 'containers/ContentfulLoader';
import { fixStyle } from 'utils/contentful';
import Quote from 'components/Contentful/Quote';
import Video from 'components/Contentful/Video';
import Menu from 'components/Contentful/Menu';
import BlogFeed from 'containers/Contentful/BlogFeed';
import { errors } from 'topcoder-react-lib';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import Countdown from 'components/Contentful/Countdown';
import Tabs from 'components/Contentful/Tabs';
import AppComponentLoader from 'components/Contentful/AppComponent';
import ContentSlider from 'components/Contentful/ContentSlider';
import Dropdown from 'components/Contentful/Dropdown';
import MemberCard from 'components/Contentful/MemberCard';

import Viewport from './Viewport';

import columnTheme from './themes/column.scss';
import rowTheme from './themes/row.scss';
import gridTheme from './themes/grid.scss';
import zurichTheme from './themes/zurich.scss';

const { fireErrorMessage } = errors;

const COMPONENTS = {
  accordion: Accordion,
  appComponent: AppComponentLoader,
  banner: Banner,
  blogPost: BlogPost,
  blogFeed: BlogFeed,
  challengesBlock: ChallengesBlock,
  contentBlock: ContentBlock,
  countdown: Countdown,
  navigationMenu: Menu,
  quote: Quote,
  tabs: Tabs,
  video: Video,
  viewport: null, /* Assigned to ViewportLoader below. */
  contentSlider: ContentSlider,
  dropdown: Dropdown,
  memberCard: MemberCard,
};

const THEMES = {
  Column: columnTheme,
  'Row with Max-Width': rowTheme,
  Grid: gridTheme,
  Zurich: zurichTheme,
};

/* Loads viewport content assets. */
function ViewportContentLoader(props) {
  const {
    contentIds,
    preview,
    spaceName,
    environment,
    themeName,
    grid,
    baseUrl,
    viewportId,
  } = props;
  let {
    extraStylesForContainer,
  } = props;

  const theme = THEMES[themeName];
  if (!theme) {
    fireErrorMessage('Unsupported theme name from contentful', '');
    return null;
  }

  if (themeName === 'Grid') {
    extraStylesForContainer = _.defaults(extraStylesForContainer || {}, {
      'grid-template-columns': `repeat(${grid.columns || 3}, 1fr)`,
      'grid-gap': `${grid.gap || 10}px`,
    });
  }

  return (
    <ContentfulLoader
      entryIds={contentIds}
      preview={preview}
      spaceName={spaceName}
      environment={environment}
      render={data => (
        <Viewport
          viewportId={viewportId}
          extraStylesForContainer={fixStyle(extraStylesForContainer)}
          theme={theme}
        >
          {
            contentIds.map((id) => {
              const type = data.entries.items[id].sys.contentType.sys.id;
              const Component = COMPONENTS[type];
              if (Component) {
                return (
                  <Component
                    baseUrl={baseUrl}
                    environment={environment}
                    id={id}
                    key={id}
                    preview={preview}
                    spaceName={spaceName}
                  />
                );
              }
              return fireErrorMessage(
                'Unsupported content type from contentful',
                '',
              );
            })
          }
        </Viewport>
      )}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ViewportContentLoader.defaultProps = {
  extraStylesForContainer: null,
  preview: false,
  spaceName: null,
  environment: null,
  themeName: 'Column',
  grid: PT.shape({
    columns: 3,
    gap: 10,
  }),
};

ViewportContentLoader.propTypes = {
  viewportId: PT.string.isRequired,
  contentIds: PT.arrayOf(PT.string.isRequired).isRequired,
  extraStylesForContainer: PT.shape(),
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
  themeName: PT.string,
  grid: PT.shape(),
  baseUrl: PT.string.isRequired,
};

/* Loads the main viewport entry. */
function ViewportLoader(props) {
  const {
    id,
    preview,
    spaceName,
    environment,
    query,
    baseUrl,
  } = props;

  const queries = [];

  if (id) {
    queries.push({ 'sys.id': id, content_type: 'viewport' });
  }

  if (query) {
    queries.push({ ...props.query, content_type: 'viewport' });
  }

  return (
    <ContentfulLoader
      entryQueries={queries}
      preview={preview}
      spaceName={spaceName}
      environment={environment}
      render={data => _.map(data.entries.items, viewport => (
        <ViewportContentLoader
          {...props}
          viewportId={viewport.sys.id}
          contentIds={_.map(viewport.fields.content, 'sys.id')}
          extraStylesForContainer={viewport.fields.extraStylesForContainer}
          key={viewport.sys.id}
          preview={preview}
          spaceName={spaceName}
          environment={environment}
          themeName={viewport.fields.theme}
          grid={{
            columns: viewport.fields.gridColumns,
            gap: viewport.fields.gridGap,
          }}
          baseUrl={baseUrl}
        />
      ))}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

COMPONENTS.viewport = ViewportLoader;

ViewportLoader.defaultProps = {
  id: null,
  preview: false,
  spaceName: null,
  environment: null,
  query: null,
  baseUrl: '',
};

ViewportLoader.propTypes = {
  id: PT.string,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
  query: PT.shape(),
  baseUrl: PT.string,
};

export default ViewportLoader;
