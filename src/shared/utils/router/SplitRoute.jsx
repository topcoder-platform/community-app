/**
 * A custom component for code splitting support, with react-router routes
 * serving as the split points. Because it is quite complex, here are only
 * some technical comments in the code. For instructions on how to use it
 * refer to 
 * https://github.com/topcoder-platform/community-app/blob/develop/docs/code-splitting.md
 */

/* global document, window */

import PT from 'prop-types';
import React from 'react';
import ReactDomServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { isServerSide } from 'utils/isomorphy';

import ContentWrapper from './ContentWrapper';

export default class SplitRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = { component: null };
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  reset() {
    /* Removing chunk's stylesheet from the DOM. */
    if (!this.props.cacheCss) {
      const link = document.querySelector(
        `link[data-chunk=${this.props.chunkName}]`);
      const head = document.getElementsByTagName('head')[0];
      head.removeChild(link);
    }

    /* Reset to the initial state. */
    this.setState({ component: null });
  }

  render() {
    const {
      chunkName,
      exact,
      location,
      path,
      renderClientAsync,
      renderPlaceholder,
      renderServer,
      strict,
    } = this.props;
    return (
      <Route
        component={this.state.component}
        exact={exact}
        location={location}
        path={path}
        render={(props) => {
          let res = null;
          if (isServerSide()) {
            /* Server-side rendering */

            /* 1. The component or its placeholder is rendered into HTML 
             *    string. And, yes, just in case we have to wrap it into
             *    Provider, otherwise containers in the render will break
             *    the code. */
            const render = renderServer || renderPlaceholder || (() => <div />);
            const html = ReactDomServer.renderToString((
              <Provider store={props.staticContext.store}>
                {render(props)}
              </Provider>
            ));

            /* 2. The rendered HTML string is added to the router context,
             *    to be injected by server/renderer.jsx into the rendered HTML 
             *    document as a field of window.SPLITS object. We also check
             *    that route ID is unique among all matched SplitRoutes. */
            const splits = props.staticContext.splits;
            if (splits[chunkName]) throw new Error('SplitRoute: IDs clash!');
            else splits[chunkName] = html;

            /* 3. The stylesheet links are injected via links elements in the
             *    header of the document, to have a better control over styles
             *    (re-)loading, independent of ReactJS mechanics of
             *    the document updates. */
            props.staticContext.chunks.push(chunkName);

            /* 4. We also render the mounted component, or the placeholder,
             *    into the document, using dangerouslySetInnerHTML to inject
             *    previously rendered HTML string into the main body of the doc.
             *    Thanks to (2) and (3), at the client side we will be able to
             *    perform exactly the same rendering even before the splitted
             *    code is loaded, thus not breaking the result of server-side
             *    rendering. */
            /* eslint-disable react/no-danger */
            res = <div dangerouslySetInnerHTML={{ __html: html }} />;
            /* eslint-enable react/no-danger */
          } else {
            /* Client side rendering */
            if (window.SPLITS[chunkName]) {
              /* If the page has been pre-rendered at the server-side, we render
               * exactly the same until the splitted code is loaded. */
              /* eslint-disable react/no-danger */
              res = (
                <div
                  dangerouslySetInnerHTML={{
                    __html: window.SPLITS[chunkName],
                  }}
                />
              );
              /* eslint-disable react/no-danger */

              /* We remove the pre-rendered HTML string from window.SPLITS,
               * because if the vistor navigates around the app and comes back
               * to this route, we want to re-render the page from scratch in
               * that case (because the state of app has changed). */
              delete window.SPLITS[chunkName];
            } else if (renderPlaceholder) {
              /* If the page has not been pre-rendered, the best we can do prior
               * the loading of split code, is to render the placeholder, if
               * provided.
               *
               * NOTE: The <div> wrappings here and in other places below may
               * look unnecessary, but they are important: we want to be sure
               * that all render options produce the same markup, thus helping
               * ReactJS to be efficient.
               */
              res = <div>{renderPlaceholder(props)}</div>;
            }

            /* The links to stylesheets are injected into document header using
             * browser's API, rather than ReactJS rendering mechanism, because
             * it gives a better control over reloading of the stylesheets and
             * helps to avoid some unnecessary flickering when the app loads a
             * page already pre-rendered at the server side. */
            let link =
              document.querySelector(`link[data-chunk="${chunkName}"]`);
            if (!link) {
              link = document.createElement('link');
              link.setAttribute('data-chunk', chunkName);
              link.setAttribute('href', `/${chunkName}.css`);
              link.setAttribute('rel', 'stylesheet');
              const head = document.getElementsByTagName('head')[0];
              head.appendChild(link);
            }

            /* Finally, we call the async renderer and once the promise it
             * returns is resolved, we set the resulting component to the state,
             * which causes it to be set on this route via "component" props,
             * that has a higher precedence that "render". The component is
             * wrapped by ContentWrapper helper, which takes care about
             * removing it from the state once it is unmounted, to ensure
             * that the next time the route is matched, its content will
             * be re-rendered from scratch. */
            renderClientAsync(props).then(component =>
              !this.unmounted && this.setState({
                component: () => (
                  <div>
                    <ContentWrapper
                      chunkName={chunkName}
                      content={component}
                      parent={this}
                    />
                  </div>
                ),
              }),
            );
          }

          return res;
        }}
        strict={strict}
      />
    );
  }
}

SplitRoute.defaultProps = {
  cacheCss: false,
  exact: false,
  location: null,
  path: null,
  renderPlaceholder: null,
  renderServer: null,
  strict: false,
};

SplitRoute.propTypes = {
  cacheCss: PT.bool,
  chunkName: PT.string.isRequired,
  exact: PT.bool,
  location: PT.shape(),
  path: PT.string,
  renderClientAsync: PT.func.isRequired,
  renderPlaceholder: PT.func,
  renderServer: PT.func,
  strict: PT.bool,
};
