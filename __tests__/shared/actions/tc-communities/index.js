import actions from 'actions/tc-communities/index';
import { services } from 'topcoder-react-lib';

const mockAddMember = jest.fn(() => Promise.resolve('dummy'));

/* The real groups service posts to the live Groups API through the library's
 * own fetch, so a mocked global.fetch does not intercept it. Left unstubbed,
 * its unhandled rejection fails whichever test runs next in the Jest worker. */
jest.mock('topcoder-react-lib', () => {
  const lib = jest.requireActual('topcoder-react-lib');
  return {
    ...lib,
    services: {
      ...lib.services,
      groups: {
        ...lib.services.groups,
        getService: jest.fn(() => ({ addMember: mockAddMember })),
      },
    },
  };
});

describe('tcCommunity.joinDone', () => {
  const a = actions.tcCommunity.joinDone('token', 'groupId', 'memberId');

  test('has expected type', () => {
    expect(a.type).toBe('TC_COMMUNITY/JOIN_DONE');
  });

  test('adds the member through the groups service without a network request', () => a.payload
    .then((res) => {
      expect(res).toEqual('dummy');
      expect(services.groups.getService).toHaveBeenCalledWith('token');
      expect(mockAddMember).toHaveBeenCalledWith('groupId', 'memberId', 'user');
    }));
});
