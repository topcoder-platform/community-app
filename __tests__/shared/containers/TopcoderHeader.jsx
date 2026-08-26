import _ from 'lodash';
import Container, { TopcoderHeader } from 'containers/TopcoderHeader';
import React from 'react';
import R from 'react-test-renderer/shallow';
import { config } from 'topcoder-react-utils';

const mockState = {
  auth: {
    profile: {},
  },
  topcoderHeader: {},
  currentNav: {
    menuTitle: 'title',
    subMenuTitle: 'subtitle',
  },
};

test('Matches shallow snapshot', () => {
  const r = new R();
  r.render((
    <Container
      store={{
        dispatch: () => _.noop,
        getState: () => mockState,
        subscribe: _.noop,
      }}
    />
  ));
  expect(r.getRenderOutput()).toMatchSnapshot();
});

test('Passes the configured universal navigation URL to the navigation loader', () => {
  const r = new R();
  r.render((
    <TopcoderHeader
      location={{
        href: 'https://www.topcoder-dev.com/challenges/challenge-id/submit',
        pathname: '/challenges/challenge-id/submit',
        search: '',
      }}
    />
  ));

  expect(r.getRenderOutput().props.children.props.uniNavUrl)
    .toBe(config.UNIVERSAL_NAV_URL);
});
