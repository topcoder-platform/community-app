import _ from 'lodash';
import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';

const rnd = new Rnd();

const mockHeaderActions = {
  tcCommunities: {
    header: {
      fetchDataInit: jest.fn(),
      fetchDataDone: jest.fn(),
      mobileToggle: jest.fn(),
    },
  },
};
jest.setMock(require.resolve('actions/tc-communities/meta'), mockHeaderActions);

const mockState = {
  tcCommunities: {
    meta: {
      communityId: 'someId',
      loading: false,
      menuItems: [
        { title: 'Menu Item 1', url: 'pageId1' },
        { title: 'Menu Item 2', url: 'pageId2' },
        { title: 'Menu Item 3', url: 'pageId3' },
      ],
      logos: ['some/logo/url'],
      cssUrl: 'some/css/url',
      isMobileOpen: false,
      failed: false,
    },
  },
};

const mockState2 = {
  tcCommunities: {
    meta: {},
  },
};

const mockState3 = {
  tcCommunities: {
    meta: {
      communityId: 'anotherId',
    },
  },
};

const mockState4 = {
  tcCommunities: {
    meta: {
      communityId: 'someId',
      isMobileOpen: true,
    },
  },
};

const Header = require('containers/tc-communities/Header').default;

beforeEach(() => jest.clearAllMocks());

test('Matches shapshot', () => {
  rnd.render((
    <Header
      match={{
        params: {
          communityId: 'someId',
        },
      }}
      store={{
        dispatch: () => _.noop,
        getState: () => mockState,
        subscribe: _.noop,
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

test('Triggers data loading if not loaded yet', () => {
  TU.renderIntoDocument((
    <Header
      match={{
        params: {
          communityId: 'someId',
        },
      }}
      store={{
        dispatch: () => _.noop,
        getState: () => mockState2,
        subscribe: _.noop,
      }}
    />
  ));
  expect(mockHeaderActions.tcCommunities.header.fetchDataInit).toHaveBeenCalled();
  expect(mockHeaderActions.tcCommunities.header.fetchDataDone).toHaveBeenCalledWith('someId');
});

test('Triggers data loading if loaded for another community', () => {
  TU.renderIntoDocument((
    <Header
      match={{
        params: {
          communityId: 'someId',
        },
      }}
      store={{
        dispatch: () => _.noop,
        getState: () => mockState3,
        subscribe: _.noop,
      }}
    />
  ));
  expect(mockHeaderActions.tcCommunities.header.fetchDataInit).toHaveBeenCalled();
  expect(mockHeaderActions.tcCommunities.header.fetchDataDone).toHaveBeenCalledWith('someId');
});

test('Triggers toggle mobile menu on click', () => {
  const page = TU.renderIntoDocument((
    <Header
      match={{
        params: {
          communityId: 'someId',
        },
      }}
      store={{
        dispatch: () => _.noop,
        getState: () => mockState3,
        subscribe: _.noop,
      }}
    />
  ));

  const btn = TU.findAllInRenderedTree(page, item =>
    item && item.className && item.className.match(/mobile-toggle/));
  expect(btn.length).toBe(1);
  TU.Simulate.click(btn[0]);
  expect(mockHeaderActions.tcCommunities.header.mobileToggle).toHaveBeenCalled();
});

test('Close mobile menu when mount', () => {
  TU.renderIntoDocument((
    <Header
      match={{
        params: {
          communityId: 'someId',
        },
      }}
      store={{
        dispatch: () => _.noop,
        getState: () => mockState4,
        subscribe: _.noop,
      }}
    />
  ));

  expect(mockHeaderActions.tcCommunities.header.mobileToggle).toHaveBeenCalled();
});
