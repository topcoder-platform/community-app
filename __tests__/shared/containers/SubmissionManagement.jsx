import _ from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { createStore } from 'redux';
import moment from 'moment';
// import { mount } from 'enzyme';

import mockChallenge from './__mocks__/challenge.json';

/* function setup(store) {
  const props = {
    onDownloadSubmission: jest.fn(),
    showModal: true,
  };

  const SubmissionManagementPageContainer = require('containers/SubmissionManagement').default;

  const enzymeWrapper = mount((
    <Provider store={store}>
      <SubmissionManagementPageContainer
        match={{ params: { challengeId: mockChallenge.challenge.id } }}
        {...props}
      />
    </Provider>
  ));

  return {
    props,
    enzymeWrapper,
  };
}*/

global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => [] }));

const reducer = _.identity;
const initialState = {
  auth: {},
  challenge: {
    details: mockChallenge.challenge,
    mySubmissionsManagement: {
      showDetails: new Set(),
    },
  },
};

const dispatch = jest.fn();// just a mock

const store = {
  ...createStore(reducer, initialState),
  dispatch,
};

let originalDateNow;

const mockedDateNow =
  moment('2017-06-05T09:53:00.000Z')
    .valueOf();

let originalRequire;

beforeEach(() => {
  originalDateNow = Date.now;
  global.Date.now = () => mockedDateNow;

  originalRequire = require;
  global.require = require('require-uncached').default;

  jest.mock('utils/config', () => ({
    API: {
      V2: 'https://api.topcoder-dev.com/v2',
      V3: 'https://api.topcoder-dev.com/v3',
    },
    OR_BASE_URL: 'https://software.topcoder-dev.com',
    HELP_URL: 'https://help.topcoder-dev.com',
    TC_BASE_URL: 'https://www.topcoder-dev.com',
  }));
});

afterEach(() => {
  global.Date.now = originalDateNow;

  global.require = originalRequire;

  jest.unmock('utils/config');
});

test('matches snapshots', () => {
  const SubmissionManagementPageContainer =
    require('containers/SubmissionManagement', { bustCache: true }).default;
  const cmp = renderer.create(
    <Provider store={store}>
      <SubmissionManagementPageContainer
        match={{ params: { challengeId: mockChallenge.challenge.id } }}
      />
    </Provider>,
  );
  expect(cmp.toJSON()).toMatchSnapshot();
});

test('matches snapshots - is loading challenge', () => {
  const { SubmissionManagementPageContainer } =
    require('containers/SubmissionManagement', { bustCache: true });
  const cmp = renderer.create(
    <Provider store={store}>
      <SubmissionManagementPageContainer
        match={{ params: { challengeId: mockChallenge.challenge.id } }}
        loadChallengeDetails={_.noop}
        isLoadingChallenge
        challenge={{}}
        authTokens={{}}
        challengeId={0}
        loadMySubmissions={_.noop}
        onShowDetails={_.noop}
        onSubmissionDelete={_.noop}
        onDownloadSubmission={_.noop}
        showDetails={{}}
        onCancelSubmissionDelete={_.noop}
        onSubmissionDeleteConfirmed={_.noop}
      />
    </Provider>,
  );
  expect(cmp.toJSON()).toMatchSnapshot();
});

test('matches snapshots - no challenge and not loading challenges', () => {
  const { SubmissionManagementPageContainer } = require('containers/SubmissionManagement');
  const cmp = renderer.create(
    <Provider store={store}>
      <SubmissionManagementPageContainer
        match={{ params: { challengeId: mockChallenge.challenge.id } }}
        loadChallengeDetails={_.noop}
        isLoadingChallenge={false}
        challenge={null}
        authTokens={{}}
        challengeId={0}
        loadMySubmissions={_.noop}
        onShowDetails={_.noop}
        onSubmissionDelete={_.noop}
        onDownloadSubmission={_.noop}
        showDetails={{}}
        onCancelSubmissionDelete={_.noop}
        onSubmissionDeleteConfirmed={_.noop}
      />
    </Provider>,
  );
  expect(cmp.toJSON()).toMatchSnapshot();
});

test('matches snapshots - no submission and not loading submissions', () => {
  const { SubmissionManagementPageContainer } = require('containers/SubmissionManagement');
  const cmp = renderer.create(
    <Provider store={store}>
      <SubmissionManagementPageContainer
        match={{ params: { challengeId: mockChallenge.challenge.id } }}
        loadChallengeDetails={_.noop}
        isLoadingChallenge={false}
        challenge={null}
        authTokens={{}}
        challengeId={0}
        loadMySubmissions={_.noop}
        onShowDetails={_.noop}
        onSubmissionDelete={_.noop}
        onDownloadSubmission={_.noop}
        showDetails={{}}
        onCancelSubmissionDelete={_.noop}
        onSubmissionDeleteConfirmed={_.noop}
        mySubmissions={null}
        isLoadingSubmissions={false}
      />
    </Provider>,
  );
  expect(cmp.toJSON()).toMatchSnapshot();
});

test('matches snapshots - show modal', () => {
  const { SubmissionManagementPageContainer } = require('containers/SubmissionManagement');
  const cmp = renderer.create(
    <Provider store={store}>
      <SubmissionManagementPageContainer
        match={{ params: { challengeId: mockChallenge.challenge.id } }}
        loadChallengeDetails={_.noop}
        isLoadingChallenge
        challenge={{}}
        authTokens={{}}
        challengeId={0}
        loadMySubmissions={_.noop}
        onShowDetails={_.noop}
        onSubmissionDelete={_.noop}
        onDownloadSubmission={_.noop}
        showDetails={{}}
        onCancelSubmissionDelete={_.noop}
        onSubmissionDeleteConfirmed={_.noop}
        showModal
      />
    </Provider>,
  );
  expect(cmp.toJSON()).toMatchSnapshot();
});

// test('onDownloadSubmission handler is called', () => {
//   const { enzymeWrapper, props } = setup(store);
//
// });

test('onCancelSubmissionDelete handler is called', () => {
  // const state = {
  //   auth: {},
  //   challenge: {
  //     details: mockChallenge.challenge,
  //     mySubmissionsManagement: {
  //       showDetails: new Set(),
  //       showModal: true,
  //     },
  //   },
  // };

  // const mockStore = {
  //   ...createStore(_.identity, state),
  //   dispatch,
  // };

  // const { enzymeWrapper, props } = setup(mockStore);

  // console.log(enzymeWrapper.prop('showModal'));
});
