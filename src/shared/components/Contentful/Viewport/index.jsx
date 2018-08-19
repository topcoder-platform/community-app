/**
 * New viewport component.
 */

import _ from 'lodash';
import Accordion from 'components/Contentful/Accordion';
import Banner from 'components/Contentful/Banner';
import ContentBlock from 'components/Contentful/ContentBlock';
import ContentfulLoader from 'containers/ContentfulLoader';
import { fixStyle } from 'utils/contentful';
import Quote from 'components/Contentful/Quote';
import Video from 'components/Contentful/Video';
import { errors } from 'topcoder-react-lib';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import { AppChunk } from 'topcoder-react-utils';
import Countdown from 'components/Contentful/Countdown';

import Viewport from './Viewport';

import columnTheme from './themes/column.scss';
import rowTheme from './themes/row.scss';
import gridTheme from './themes/grid.scss';

const { fireErrorMessage } = errors;

const THEMES = {
  Column: columnTheme,
  'Row with Max-Width': rowTheme,
  Grid: gridTheme,
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
    extraStylesForContainer = _.assign(extraStylesForContainer || {}, {
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
        <Viewport extraStylesForContainer={fixStyle(extraStylesForContainer)} theme={theme}>
          {
            contentIds.map((id) => {
              if (data.entries.items[id].sys.contentType.sys.id === 'accordion') {
                return (
                  <Accordion
                    id={id}
                    key={id}
                    preview={preview}
                    spaceName={spaceName}
                    environment={environment}
                  />
                );
              } if (data.entries.items[id].sys.contentType.sys.id === 'banner') {
                return (
                  <Banner
                    id={id}
                    key={id}
                    preview={preview}
                    spaceName={spaceName}
                    environment={environment}
                  />
                );
              } if (data.entries.items[id].sys.contentType.sys.id === 'contentBlock') {
                return (
                  <ContentBlock
                    id={id}
                    key={id}
                    preview={preview}
                    spaceName={spaceName}
                    environment={environment}
                  />
                );
              } if (data.entries.items[id].sys.contentType.sys.id === 'quote') {
                return (
                  <Quote
                    id={id}
                    key={id}
                    preview={preview}
                    spaceName={spaceName}
                    environment={environment}
                  />
                );
              } if (data.entries.items[id].sys.contentType.sys.id === 'video') {
                return (
                  <Video
                    id={id}
                    key={id}
                    preview={preview}
                    spaceName={spaceName}
                    environment={environment}
                  />
                );
              } if (data.entries.items[id].sys.contentType.sys.id === 'viewport') {
                return (
                  <ViewportLoader
                    id={id}
                    key={id}
                    preview={preview}
                    spaceName={spaceName}
                    environment={environment}
                  />
                );
              } if (data.entries.items[id].sys.contentType.sys.id === 'appComponent') {
                return (
                  <AppComponentLoader
                    id={id}
                    key={id}
                    preview={preview}
                    spaceName={spaceName}
                    environment={environment}
                  />
                );
              } if (data.entries.items[id].sys.contentType.sys.id === 'countdown') {
                return (
                  <Countdown
                    id={id}
                    key={id}
                    preview={preview}
                    spaceName={spaceName}
                    environment={environment}
                  />
                );
              }
              fireErrorMessage('Unsupported content type from contentful', '');
              return null;
            })
          }
        </Viewport>
      )}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

function AppComponentLoader(props) {
  const {
    id,
    preview,
    spaceName,
    environment,
  } = props;

  const queries = [];

  if (id) {
    queries.push({ 'sys.id': id, content_type: 'appComponent' });
  }

  return (
    <ContentfulLoader
      entryQueries={queries}
      preview={preview}
      spaceName={spaceName}
      environment={environment}
      render={data => _.map(data.entries.items, (appComponent) => {
        if (appComponent.fields.type === 'TCO-Leaderboard') {
          return (
            <AppChunk
              chunkName="leaderboard/chunk"
              renderClientAsync={() => import(/* webpackChunkName: "leaderboard/chunk" */ 'containers/tco/Leaderboard')
                .then(({ default: Leaderboard }) => (
                  <Leaderboard
                    apiUrl={appComponent.fields.props.leaderboardApiUrl}
                    title={appComponent.fields.props.title}
                    podiumSpots={appComponent.fields.props.podiumSpots}
                    isCopilot={appComponent.fields.props.isCopilot}
                    key={appComponent.sys.id}
                  />
                ))
              }
              renderPlaceholder={() => <LoadingIndicator />}
              key={appComponent.sys.id}
            />
          );
        }
        fireErrorMessage('Unsupported app component type from contentful', '');
        return null;
      })}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

AppComponentLoader.defaultProps = {
  id: null,
  preview: false,
  spaceName: null,
  environment: null,
};

AppComponentLoader.propTypes = {
  id: PT.string,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
};

ViewportContentLoader.defaultProps = {
  extraStylesForContainer: null,
  spaceName: null,
  environment: null,
  themeName: 'Column',
  grid: PT.shape({
    columns: 3,
    gap: 10,
  }),
};

ViewportContentLoader.propTypes = {
  contentIds: PT.arrayOf(PT.string.isRequired).isRequired,
  extraStylesForContainer: PT.shape(),
  preview: PT.bool.isRequired,
  spaceName: PT.string,
  environment: PT.string,
  themeName: PT.string,
  grid: PT.shape(),
};

/* Loads the main viewport entry. */
function ViewportLoader(props) {
  const {
    id,
    preview,
    spaceName,
    environment,
    query,
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
        />
      ))}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ViewportLoader.defaultProps = {
  id: null,
  preview: false,
  spaceName: null,
  environment: null,
  query: null,
};

ViewportLoader.propTypes = {
  id: PT.string,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
  query: PT.shape(),
};

export default ViewportLoader;
