/**
 * Generates a routing structure based on the provided Contentful Route model
 * content, including any sub-routes.  Will also render any Viewports linked
 * by the above content in their respective url segments.
 */
import _ from 'lodash';
import ContentfulLoader from 'containers/ContentfulLoader';
import Error404 from 'components/Error404';
import LoadingIndicator from 'components/LoadingIndicator';
import MetaTags from 'components/MetaTags';
import PT from 'prop-types';
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Viewport from 'components/Contentful/Viewport';
import { isomorphy, config } from 'topcoder-react-utils';
import cookies from 'browser-cookies';
import { removeTrailingSlash } from 'utils/url';

// Concatenates a base and segment and handles optional trailing slashes
const buildUrl = (base, segment) => `${_.trimEnd(base, '/')}/${_.trim(segment, '/')}`;

function ChildRoutesLoader(props) {
  const {
    error404,
    fields,
    preview,
    spaceName,
    environment,
    url,
  } = props;

  const ids = _.map(fields.childRoutes, 'sys.id');

  return (
    <ContentfulLoader
      entryIds={ids}
      preview={preview}
      spaceName={spaceName}
      environment={environment}
      render={data => (
        <Switch>
          <Route
            exact
            path={url}
            render={() => (
              <React.Fragment>
                <MetaTags
                  description={fields.description}
                  image={fields.socialThumbnail}
                  siteName={fields.socialSiteName}
                  socialDescription={fields.socialDescription}
                  socialTitle={fields.socialTitle}
                  title={fields.pageTitle}
                  url={fields.socialUrl}
                />
                {
                  // eslint-disable-next-line no-nested-ternary
                  fields.viewport
                    ? (
                    <Viewport
                      id={fields.viewport.sys.id}
                      preview={preview}
                      spaceName={spaceName}
                      environment={environment}
                      baseUrl={url}
                    />
                  ) : <Error404 />
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
                spaceName={spaceName}
                environment={environment}
              />
            )))
          }
          {error404 || <Route component={error404 || Error404} />}
        </Switch>
      )}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ChildRoutesLoader.defaultProps = {
  error404: null,
  spaceName: null,
  environment: null,
};

ChildRoutesLoader.propTypes = {
  error404: PT.node,
  fields: PT.shape().isRequired,
  preview: PT.bool.isRequired,
  spaceName: PT.string,
  environment: PT.string,
  url: PT.string.isRequired,
};

function RedirectWithStatus({ from, to, status }) {
  return (
    <Route
      render={({ staticContext }) => {
        if (to[0] !== '/' && isomorphy.isClientSide()) {
          window.location.href = to;
          return null;
        }
        // there is no `staticContext` on the client, so
        // we need to guard against that here
        if (staticContext) staticContext.status = status;
        return <Redirect from={from} to={to} />;
      }}
    />
  );
}

RedirectWithStatus.propTypes = {
  from: PT.string.isRequired,
  to: PT.string.isRequired,
  status: PT.number.isRequired,
};

export default function ContentfulRoute(props) {
  const {
    baseUrl,
    error404,
    id,
    name,
    path,
    preview,
    spaceName,
    environment,
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
      spaceName={spaceName}
      environment={environment}
      render={(data) => {
        const { fields } = Object.values(data.entries.items)[0];
        const url = path || buildUrl(baseUrl, fields.url);
        // eslint-disable-next-line no-restricted-globals
        const currentPathname = typeof location === 'undefined' ? '' : removeTrailingSlash(location.pathname);
        const redirectToUrl = _.trim(fields.redirectToUrl);
        const requireLogin = fields.protected;
        const loggedIn = isomorphy.isClientSide() && cookies.get('tcjwt') !== null;
        if (requireLogin && !loggedIn) {
          // route is protected by TC Login
          // send to login/register with proper retUrl set
          const authUrl = config.URL.AUTH;
          return <RedirectWithStatus status={401} from={url} to={`${authUrl}?retUrl=${encodeURIComponent(config.URL.BASE + url)}`} />;
        }
        return redirectToUrl && currentPathname === url ? (
          <RedirectWithStatus status={301} from={url} to={redirectToUrl} />
        ) : (
          <Route
            /* This route prevents fetching data about child routes and their
             * rendering, if they already known to not match. */
            path={url}
            render={() => (
              <ChildRoutesLoader
                error404={error404}
                fields={fields}
                preview={preview}
                spaceName={spaceName}
                environment={environment}
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
  spaceName: null,
  environment: null,
};

ContentfulRoute.propTypes = {
  baseUrl: PT.string,
  error404: PT.node,
  id: PT.string,
  name: PT.string,
  path: PT.string, // This can also be used to override the url from Contentful
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
};
