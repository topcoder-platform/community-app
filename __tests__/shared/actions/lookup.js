import * as LookupService from 'services/lookup';
import actions from 'actions/lookup';

const tag = {
  domain: 'SKILLS',
  id: 251,
  name: 'Jekyll',
  status: 'APPROVED',
};

// Mock services
const mockLookupService = {
  getTags: jest.fn().mockReturnValue(Promise.resolve([tag])),
};
LookupService.getService = jest.fn().mockReturnValue(mockLookupService);


describe('lookup.getApprovedSkills', () => {
  const a = actions.lookup.getApprovedSkills();

  test('has expected type', () => {
    expect(a.type).toEqual('LOOKUP/GET_APPROVED_SKILLS');
  });

  test('Approved skills should be returned', () =>
    a.payload.then((res) => {
      expect(res).toEqual([tag]);
      expect(mockLookupService.getTags).toBeCalled();
    }));
});
