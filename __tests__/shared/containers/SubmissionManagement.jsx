import _ from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { createStore } from 'redux';
import mockChallenge from './__mocks__/challenge.json';

import SubmissionManagement from 'containers/SubmissionManagement';

global.fetch = jest.fn(() =>
  Promise.resolve({json: () => [],}));

const reducer = _.identity,

  initialState = {
    auth: {},
    challenge: {
      details: mockChallenge.challenge,
      mySubmissionsManagement: {
        showDetails: new Set,
      },
    }
  },

  dispatch = jest.fn(),// just a mock

  store = {
    ...createStore(reducer, initialState),
    dispatch,
  };

test('matches snapshots', () => {
  const cmp = renderer.create(
    <Provider store={store}>
      <SubmissionManagement match={{params: {challengeId: mockChallenge.challenge.id}}}/>
    </Provider>
  );
  expect(cmp.toJSON()).toMatchSnapshot();
});
