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
    error404,
    fields,
    preview,
    url,
  } = props;

  const ids = _.map(fields.childRoutes, 'sys.id');

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
                  fields.viewport
                    ? <Viewport id={fields.viewport.sys.id} preview={preview} /> : <Error404 />
                }
              </React.Fragment>
            )}
          />
          {
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
          { error404 || <Route component={error404 || Error404} /> }
        </Switch>
      )}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ChildRoutesLoader.defaultProps = {
  error404: null,
};

ChildRoutesLoader.propTypes = {
  error404: PT.node,
  fields: PT.shape().isRequired,
  preview: PT.bool.isRequired,
  url: PT.string.isRequired,
};

export default function ContentfulRoute(props) {
  const {
    baseUrl,
    error404,
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
          <Route
            /* This route prevents fetching data about child routes and their
             * rendering, if they already known to not match. */
            path={url}
            render={() => (
              <ChildRoutesLoader
                error404={error404}
                fields={fields}
                preview={preview}
                url={url}
              />
            )}
          />
        );
      }}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ContentfulRoute.defaultProps = {
  baseUrl: '',
  error404: null,
  id: '',
  name: '',
  path: '',
  preview: false,
};

ContentfulRoute.propTypes = {
  baseUrl: PT.string,
  error404: PT.node,
  id: PT.string,
  name: PT.string,
  path: PT.string, // This can also be used to override the url from Contentful
  preview: PT.bool,
};
