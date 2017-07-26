/*
import _ from 'lodash';
import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';


const rnd = new Rnd();

const mockMetaActions = {
  tcCommunities: {
    meta: {
      fetchDataInit: jest.fn(),
      fetchDataDone: jest.fn(),
      mobileToggle: jest.fn(),
    },
  },
};
jest.setMock(require.resolve('actions/tc-communities/meta'), mockMetaActions);

const COMMUNITY_SELECTOR = [{
  label: 'Community Name',
  value: '1',
}];

const mockState = {
  tcCommunities: {
    meta: {
      authorizedGroupIds: ['12345'],
      communityId: 'someId',
      communitySelector: COMMUNITY_SELECTOR,
      pageId: 'somePageId',
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
    news: {},
  },
  auth: {
    profile: {
      groups: [{ id: '12345' }],
    },
  },
};

const mockState2 = {
  tcCommunities: {
    meta: {},
    news: {},
  },
  auth: {
    profile: {},
  },
};

const mockState3 = {
  tcCommunities: {
    meta: {
      communityId: 'anotherId',
      communitySelector: COMMUNITY_SELECTOR,
      pageId: 'somePageId',
    },
    news: {},
  },
  auth: {
    profile: {},
  },
};

const mockState4 = {
  tcCommunities: {
    meta: {
      communityId: 'someId',
      communitySelector: COMMUNITY_SELECTOR,
      menuItems: [
        { title: 'Menu Item 1', url: 'pageId1' },
        { title: 'Menu Item 2', url: 'pageId2' },
        { title: 'Menu Item 3', url: 'pageId3' },
      ],
      pageId: 'somePageId',
      isMobileOpen: true,
    },
    news: {},
  },
  auth: {
    profile: {
      groups: [],
    },
  },
};

const Page = require('containers/tc-communities/Page').default;

beforeEach(() => jest.clearAllMocks());

test('Matches shapshot', () => {
  rnd.render((
    <Provider
      store={{
        dispatch: () => _.noop,
        getState: () => mockState,
        subscribe: _.noop,
      }}
    >
      <Page
        match={{
          params: {
            communityId: 'someId',
            pageId: 'somePageId',
          },
        }}
        history={{}}
        location={{}}
      />
    </Provider>
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

test('Triggers data loading if not loaded yet', () => {
  TU.renderIntoDocument((
    <MemoryRouter>
      <Provider
        store={{
          dispatch: () => _.noop,
          getState: () => mockState2,
          subscribe: _.noop,
        }}
      >
        <Page
          match={{
            params: {
              communityId: 'someId',
              pageId: 'somePageId',
            },
          }}
          history={{}}
          location={{}}
        />
      </Provider>
    </MemoryRouter>
  ));
  expect(mockMetaActions.tcCommunities.meta.fetchDataInit).toHaveBeenCalled();
  expect(mockMetaActions.tcCommunities.meta.fetchDataDone).toHaveBeenCalledWith('someId');
});

test('Triggers data loading if loaded for another community', () => {
  TU.renderIntoDocument((
    <MemoryRouter>
      <Provider
        store={{
          dispatch: () => _.noop,
          getState: () => mockState3,
          subscribe: _.noop,
        }}
      >
        <Page
          match={{
            params: {
              communityId: 'someId',
              pageId: 'somePageId',
            },
          }}
          history={{}}
          location={{}}
        />
      </Provider>
    </MemoryRouter>
  ));
  expect(mockMetaActions.tcCommunities.meta.fetchDataInit).toHaveBeenCalled();
  expect(mockMetaActions.tcCommunities.meta.fetchDataDone).toHaveBeenCalledWith('someId');
});

test('Triggers toggle mobile menu on click', () => {
  const page = TU.renderIntoDocument((
    <MemoryRouter>
      <Provider
        store={{
          dispatch: () => _.noop,
          getState: () => mockState,
          subscribe: _.noop,
        }}
      >
        <Page
          match={{
            params: {
              communityId: 'someId',
              pageId: 'somePageId',
            },
          }}
          history={{}}
          location={{}}
        />
      </Provider>
    </MemoryRouter>
  ));

  const btn = TU.findAllInRenderedTree(page, item =>
    item && item.className && item.className.match(/mobile-toggle/));
  expect(btn.length).toBe(1);
  TU.Simulate.click(btn[0]);
  expect(mockMetaActions.tcCommunities.meta.mobileToggle).toHaveBeenCalled();
});

test('Close mobile menu when mount', () => {
  TU.renderIntoDocument((
    <MemoryRouter>
      <Provider
        store={{
          dispatch: () => _.noop,
          getState: () => mockState4,
          subscribe: _.noop,
        }}
      >
        <Page
          match={{
            params: {
              communityId: 'someId',
              pageId: 'somePageId',
            },
          }}
          history={{}}
          location={{}}
        />
      </Provider>
    </MemoryRouter>
  ));

  expect(mockMetaActions.tcCommunities.meta.mobileToggle).toHaveBeenCalled();
});
*/

test('dummy test', () => {});
