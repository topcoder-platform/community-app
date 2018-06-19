/**
 * New viewport component.
 */

import _ from 'lodash';
import Accordion from 'components/Contentful/Accordion';
import Banner from 'components/Contentful/Banner';
import ContentBlock from 'components/Contentful/ContentBlock';
import ContentfulLoader from 'containers/ContentfulLoader';
import Quote from 'components/Contentful/Quote';
import Video from 'components/Contentful/Video';
import { errors } from 'topcoder-react-lib';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';

const { fireErrorMessage } = errors;

/* Loads viewport content assets. */
function ViewportContentLoader(props) {
  const { contentIds, preview } = props;

  return (
    <ContentfulLoader
      entryIds={contentIds}
      preview={preview}
      render={data =>
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
          }
          fireErrorMessage('Unsupported content type from contentful', '');
          return null;
        })
      }
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ViewportContentLoader.propTypes = {
  contentIds: PT.arrayOf(PT.string.isRequired).isRequired,
  preview: PT.bool.isRequired,
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
      render={(data) => {
        const contentIds = [];
        _.forOwn(data.entries.items, (item) => {
          const content = item.fields.content || [];
          content.forEach(c => contentIds.push(c.sys.id));
        });
        if (!contentIds.length) return null;

        return (
          <ViewportContentLoader
            {...props}
            contentIds={contentIds}
            preview={preview}
          />
        );
      }}
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
