/**
 * A custom component for code splitting support, with react-router routes
 * serving as the split points. Because it is quite complex, here are only
 * some technical comments in the code. For instructions on how to use it
 * refer to 
 * https://github.com/topcoder-platform/community-app/blob/develop/docs/code-splitting.md
 */

/* global window */

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

  reset() {
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
            let html = ReactDomServer.renderToString((
              <Provider store={props.staticContext.store}>
                {render(props)}
              </Provider>
            ));
            html = `<link href="/${chunkName}.css" rel="stylesheet" />${html}`;

            /* 2. The rendered HTML string is added to the router context,
             *    to be injected by server/renderer.jsx into the rendered HTML 
             *    document as a field of window.SPLITS object. We also check
             *    that route ID is unique among all matched SplitRoutes. */
            const splits = props.staticContext.splits;
            if (splits[chunkName]) throw new Error('SplitRoute: IDs clash!');
            else splits[chunkName] = html;

            /* 3. We also render the mounted component, or the placeholder,
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
                <div dangerouslySetInnerHTML={{ __html: window.SPLITS[chunkName] }} />
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
               * provided. */
              res = renderPlaceholder(props);
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
              this.setState({
                component: () => (
                  <ContentWrapper
                    chunkName={chunkName}
                    content={component}
                    parent={this}
                  />
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
  exact: false,
  location: null,
  path: null,
  renderPlaceholder: null,
  renderServer: null,
  strict: false,
};

SplitRoute.propTypes = {
  exact: PT.bool,
  chunkName: PT.string.isRequired,
  location: PT.shape(),
  path: PT.string,
  renderClientAsync: PT.func.isRequired,
  renderPlaceholder: PT.func,
  renderServer: PT.func,
  strict: PT.bool,
};
