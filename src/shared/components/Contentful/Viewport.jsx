/**
 * New viewport component.
 */

import _ from 'lodash';
import Banner from 'components/Contentful/Banner';
import ContentBlock from 'components/Contentful/ContentBlock';
import ContentfulLoader from 'containers/ContentfulLoader';
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
          if (data.entries.items[id].sys.contentType.sys.id === 'banner') {
            return (
              <Banner id={id} key={id} preview={preview} />
            );
          } else if (data.entries.items[id].sys.contentType.sys.id === 'contentBlock') {
            return (
              <ContentBlock id={id} key={id} preview={preview} />
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

  let query;

  if (props.query) {
    query = _.defaults(_.clone(props.query), {
      content_type: 'viewport',
      include: 2,
    });
  }

  return (
    <ContentfulLoader
      entryIds={id}
      entryQueries={query}
      preview={preview}
      render={(data) => {
        // _.map(data.entries.items, 'fields.content') returns an array containing
        // the 'content' arrays of each matched viewport.
        // flatten turns this into an array containing the viewport content objects of all viewports
        // the outer map grabs just the id from each viewport object
        // Result: An array of id strings

        const contentIds = _.map(_.flatten(_.map(data.entries.items, 'fields.content')), 'sys.id');

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
