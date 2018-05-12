import { mockAction } from 'utils/mock';
import { redux } from 'topcoder-react-utils';

const tag = {
  domain: 'SKILLS',
  id: 251,
  name: 'Jekyll',
  status: 'APPROVED',
};

const mockActions = {
  lookup: {
    getApprovedSkills: mockAction('LOOKUP/GET_APPROVED_SKILLS', Promise.resolve([tag])),
    getApprovedSkillsError: mockAction('LOOKUP/GET_APPROVED_SKILLS', null, 'Unknown error'),
  },
};
jest.setMock(require.resolve('actions/lookup'), mockActions);

const reducers = require('reducers/lookup');

let reducer;

function testReducer(istate) {
  test('Initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(istate);
  });

  test('Load approved skills', () =>
    redux.resolveAction(mockActions.lookup.getApprovedSkills()).then((action) => {
      const state = reducer({}, action);
      expect(state).toEqual({
        approvedSkills: [tag],
        loadingApprovedSkillsError: false,
      });
    }));

  test('Load approved skills error', () => {
    const state = reducer({}, mockActions.lookup.getApprovedSkillsError());
    expect(state).toEqual({
      loadingApprovedSkillsError: true,
    });
  });
}

describe('Default reducer', () => {
  reducer = reducers.default;
  testReducer({ approvedSkills: [] });
});

describe('Factory without server side rendering', () => {
  beforeAll((done) => {
    reducers.factory().then((res) => {
      reducer = res;
      done();
    });
  });
  testReducer({ approvedSkills: [] });
});
