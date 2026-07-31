import { resolveSubmissionMode } from 'components/SubmissionPage/Submit';

jest.mock('components/SubmissionPage/FilestackFilePicker', () => 'FilestackFilePicker');

const topgearCommunitiesList = {
  data: [
    {
      groupIds: ['wipro-group-id'],
      mainSubdomain: 'topgear',
    },
  ],
  loadingUuid: '',
  timestamp: Date.now(),
};

describe('resolveSubmissionMode', () => {
  test('uses zip upload when submission_type metadata is zip', () => {
    expect(resolveSubmissionMode(
      [{ name: 'submission_type', value: 'zip' }],
      ['wipro-group-id'],
      topgearCommunitiesList,
    )).toEqual({
      isLoadingCommunitiesList: false,
      isUrlSubmission: false,
    });
  });

  test('uses URL upload when submission_type metadata is url', () => {
    expect(resolveSubmissionMode(
      [{ name: 'submission_type', value: 'url' }],
      [],
      topgearCommunitiesList,
    )).toEqual({
      isLoadingCommunitiesList: false,
      isUrlSubmission: true,
    });
  });

  test('falls back to URL upload for Topgear groups when metadata is absent', () => {
    expect(resolveSubmissionMode(
      [],
      ['wipro-group-id'],
      topgearCommunitiesList,
    )).toEqual({
      isLoadingCommunitiesList: false,
      isUrlSubmission: true,
    });
  });

  test('waits for communities list before applying the legacy group fallback', () => {
    expect(resolveSubmissionMode(
      [],
      ['wipro-group-id'],
      {
        data: [],
        loadingUuid: '',
        timestamp: 0,
      },
    )).toEqual({
      isLoadingCommunitiesList: true,
      isUrlSubmission: false,
    });
  });
});
