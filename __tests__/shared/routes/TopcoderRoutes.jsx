import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import { Route, Switch, matchPath } from 'react-router-dom';
import { config } from 'topcoder-react-utils';

import ContentfulRoute from 'components/Contentful/Route';
import Footer from 'components/TopcoderFooter';
import Header from 'containers/TopcoderHeader';
import EDUHome from 'routes/EDUHome';
import EDUSearch from 'routes/EDUSearch';
import EDUTracks from 'routes/EDUTracks';
import Topcoder from 'routes/Topcoder/Routes';

test('matches exact Thrive routes before the generic root Contentful route', () => {
  const renderer = new Renderer();
  renderer.render(<Topcoder />);

  const output = renderer.getRenderOutput();
  const children = React.Children.toArray(output.props.children);
  const routeSwitch = children[1];
  const routes = React.Children.toArray(routeSwitch.props.children);
  const contentfulRouteIndex = routes.findIndex(route => route.type === ContentfulRoute);
  const expectedRoutes = [
    {
      component: EDUHome,
      path: config.TC_EDU_BASE_PATH,
      pathname: config.TC_EDU_BASE_PATH,
    },
    {
      component: EDUTracks,
      path: `${config.TC_EDU_BASE_PATH}${config.TC_EDU_TRACKS_PATH}`,
      pathname: `${config.TC_EDU_BASE_PATH}${config.TC_EDU_TRACKS_PATH}`,
    },
    {
      component: EDUSearch,
      path: `${config.TC_EDU_BASE_PATH}${config.TC_EDU_SEARCH_PATH}`,
      pathname: `${config.TC_EDU_BASE_PATH}${config.TC_EDU_SEARCH_PATH}`,
    },
    {
      path: `${config.TC_EDU_BASE_PATH}${config.TC_EDU_ARTICLES_PATH}/:articleTitle`,
      pathname: `${config.TC_EDU_BASE_PATH}${config.TC_EDU_ARTICLES_PATH}/routing-test`,
    },
  ];

  expect(children[0].type).toBe(Header);
  expect(routeSwitch.type).toBe(Switch);
  expect(children[2].type).toBe(Footer);
  expect(contentfulRouteIndex).toBeGreaterThan(-1);

  expectedRoutes.forEach((expectedRoute) => {
    const routeIndex = routes.findIndex(route => (
      route.type === Route && route.props.path === expectedRoute.path
    ));
    const route = routes[routeIndex];

    expect(routeIndex).toBeGreaterThan(-1);
    expect(routeIndex).toBeLessThan(contentfulRouteIndex);
    expect(route.props.exact).toBe(true);
    expect(matchPath(expectedRoute.pathname, route.props)).not.toBeNull();
    if (expectedRoute.component) {
      expect(route.props.component).toBe(expectedRoute.component);
    }
  });
});
