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

import Viewport from './Viewport';

import columnTheme from './themes/column.scss';
import rowTheme from './themes/row.scss';

const { fireErrorMessage } = errors;

const THEMES = {
  Column: columnTheme,
  'Row with Max-Width': rowTheme,
};

/* Loads viewport content assets. */
function ViewportContentLoader(props) {
  const {
    contentIds,
    extraStylesForContainer,
    preview,
    themeName,
  } = props;

  const theme = THEMES[themeName];

  if (!theme) {
    fireErrorMessage('Unsupported theme name from contentful', '');
    return null;
  }

  return (
    <ContentfulLoader
      entryIds={contentIds}
      preview={preview}
      render={data => (
        <Viewport extraStylesForContainer={fixStyle(extraStylesForContainer)} theme={theme}>
          {
            contentIds.map((id) => {
              if (data.entries.items[id].sys.contentType.sys.id === 'accordion') {
                return (
                  <Accordion id={id} key={id} preview={preview} />
                );
              } else if (data.entries.items[id].sys.contentType.sys.id === 'banner') {
                return (
                  <Banner id={id} key={id} preview={preview} />
                );
              } else if (data.entries.items[id].sys.contentType.sys.id === 'contentBlock') {
                return (
                  <ContentBlock id={id} key={id} preview={preview} />
                );
              } else if (data.entries.items[id].sys.contentType.sys.id === 'quote') {
                return (
                  <Quote id={id} key={id} preview={preview} />
                );
              } else if (data.entries.items[id].sys.contentType.sys.id === 'video') {
                return (
                  <Video id={id} key={id} preview={preview} />
                );
              } else if (data.entries.items[id].sys.contentType.sys.id === 'viewport') {
                return (
                  <ViewportLoader id={id} key={id} preview={preview} />
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

ViewportContentLoader.defaultProps = {
  extraStylesForContainer: null,
  themeName: 'Column',
};

ViewportContentLoader.propTypes = {
  contentIds: PT.arrayOf(PT.string.isRequired).isRequired,
  extraStylesForContainer: PT.shape(),
  preview: PT.bool.isRequired,
  themeName: PT.string,
};

/* Loads the main viewport entry. */
function ViewportLoader(props) {
  const {
    id,
    preview,
  } = props;

  const queries = [];

  if (id) {
    queries.push({ 'sys.id': id, content_type: 'viewport' });
  }

  if (props.query) {
    queries.push({ ...props.query, content_type: 'viewport' });
  }

  return (
    <ContentfulLoader
      entryQueries={queries}
      preview={preview}
      render={data => _.map(data.entries.items, viewport => (
        <ViewportContentLoader
          {...props}
          contentIds={_.map(viewport.fields.content, 'sys.id')}
          extraStylesForContainer={viewport.fields.extraStylesForContainer}
          key={viewport.sys.id}
          preview={preview}
          themeName={viewport.fields.theme}
        />
      ))}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ViewportLoader.defaultProps = {
  id: null,
  preview: false,
  query: null,
};

ViewportLoader.propTypes = {
  id: PT.string,
  preview: PT.bool,
  query: PT.shape(),
};

export default ViewportLoader;
