/**
 * Generates a routing structure based on the provided Contentful Route model
 * content, including any sub-routes.  Will also render any Viewports linked
 * by the above content in their respective url segments.
 */
import _ from 'lodash';
import ContentfulLoader from 'containers/ContentfulLoader';
import Error404 from 'components/Error404';
import LoadingIndicator from 'components/LoadingIndicator';
import { MetaTags } from 'topcoder-react-utils';
import PT from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Viewport from 'components/Contentful/Viewport';

// Concatenates a base and segment and handles optional trailing slashes
const buildUrl = (base, segment) => `${_.trimEnd(base, '/')}/${_.trim(segment, '/')}`;

function ChildRoutesLoader(props) {
  const {
    fields,
    ids,
    preview,
    url,
  } = props;

  return (
    <ContentfulLoader
      entryIds={ids}
      preview={preview}
      render={data => (
        <Switch>
          <Route
            exact
            path={url}
            render={() => (
              <React.Fragment>
                <MetaTags
                  description={fields.description}
                  image={fields.thumbnail}
                  siteName={fields.socialSiteName}
                  socialDescription={fields.socialDescription}
                  socialTitle={fields.socialTitle}
                  title={fields.pageTitle}
                  url={fields.socialUrl}
                />
                {
                  fields.viewport ?
                    <Viewport id={fields.viewport.sys.id} preview={preview} /> : <Error404 />
                }
              </React.Fragment>
            )}
          />
          {
            /**
             * TODO: Technically, it means that we are going to load entire
             * tree of routes, even for the paths that are guaranteed not to
             * match. It should optimized to load only those child routes that
             * may match, judging by the currently tested route segment.
             */
            _.map(data.entries.items, (childRoute => (
              <ContentfulRoute
                id={childRoute.sys.id}
                key={childRoute.sys.id}
                // The path prop is also read by the <Switch> component to
                // determine if any Routes have matched
                path={buildUrl(url, childRoute.fields.url)}
                preview={preview}
              />
            )))
          }
          <Route component={Error404} />
        </Switch>
      )}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ChildRoutesLoader.propTypes = {
  fields: PT.shape().isRequired,
  ids: PT.arrayOf(PT.string).isRequired,
  preview: PT.bool.isRequired,
  url: PT.string.isRequired,
};

export default function ContentfulRoute(props) {
  const {
    baseUrl,
    id,
    name,
    path,
    preview,
  } = props;

  const queries = [];

  /* Mapping `id` to query helps to fetch the route entry and its children with
   * a single call to Contentful API, which is handy for Route content type. */
  if (id) queries.push({ content_type: 'route', 'sys.id': id });
  if (name) queries.push({ content_type: 'route', 'fields.name': name });

  return (
    <ContentfulLoader
      entryQueries={queries}
      preview={preview}
      render={(data) => {
        const { fields } = Object.values(data.entries.items)[0];
        const url = path || buildUrl(baseUrl, fields.url);
        return (
          <ChildRoutesLoader
            fields={fields}
            ids={_.map(fields.childRoutes, 'sys.id')}
            preview={preview}
            url={url}
          />
        );
      }}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ContentfulRoute.defaultProps = {
  baseUrl: '',
  id: '',
  name: '',
  path: '',
  preview: false,
};

ContentfulRoute.propTypes = {
  baseUrl: PT.string,
  id: PT.string,
  name: PT.string,
  path: PT.string, // This can also be used to override the url from Contentful
  preview: PT.bool,
};
