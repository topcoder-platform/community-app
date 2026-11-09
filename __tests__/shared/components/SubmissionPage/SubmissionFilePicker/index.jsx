import { shallow } from 'enzyme';
import React from 'react';
import uploadSubmission from 'services/s3Upload';
import SubmissionFilePicker from 'components/SubmissionPage/SubmissionFilePicker';

jest.mock('services/s3Upload', () => jest.fn());

describe('SubmissionFilePicker', () => {
  let props;
  beforeEach(() => {
    jest.clearAllMocks();
    props = {
      tokenV3: 'member-token',
      challengeId: 'challenge-1',
      fileName: '',
      fileExtensions: ['.zip'],
      title: 'Upload submission',
      setError: jest.fn(),
      setFileName: jest.fn(),
      setUploadProgress: jest.fn(),
      dragged: false,
      setDragged: jest.fn(),
      setUploadData: jest.fn(),
    };
  });

  test('uses a native local ZIP input and persists the server-selected S3 location', async () => {
    const wrapper = shallow(<SubmissionFilePicker {...props} />);
    expect(wrapper.find('input[type="file"]').prop('accept')).toBe('.zip');
    const file = new File(['zip'], 'solution.zip', { type: 'application/zip' });
    uploadSubmission.mockResolvedValue({
      filename: file.name,
      mimetype: file.type,
      size: file.size,
      container: 'submission-dmz',
      key: 'uppy/solution.zip',
      url: 'https://s3.amazonaws.com/submission-dmz/uppy/solution.zip',
    });
    await wrapper.instance().uploadFile(file);
    expect(uploadSubmission).toHaveBeenCalledWith(file, 'member-token', 'challenge-1', expect.any(Function), expect.anything());
    expect(props.setUploadData).toHaveBeenLastCalledWith(expect.objectContaining({
      fileUrl: 'https://s3.amazonaws.com/submission-dmz/uppy/solution.zip', key: 'uppy/solution.zip',
    }));
  });

  test('clears stale submissions and displays upload failures', async () => {
    uploadSubmission.mockRejectedValue(new Error('Network unavailable'));
    const wrapper = shallow(<SubmissionFilePicker {...props} />);
    await wrapper.instance().uploadFile(new File(['zip'], 'solution.zip'));
    expect(props.setUploadData).toHaveBeenCalledWith(expect.objectContaining({ key: '', size: 0 }));
    expect(props.setError).toHaveBeenLastCalledWith('Network unavailable');
    expect(wrapper.state('uploading')).toBe(false);
  });

  test('cancels an in-flight upload when unmounted', async () => {
    uploadSubmission.mockImplementation((file, token, challenge, progress, signal) => (
      new Promise((resolve, reject) => {
        signal.addEventListener('abort', () => reject(
          Object.assign(new Error('Cancelled'), { name: 'AbortError' }),
        ));
      })
    ));
    const wrapper = shallow(<SubmissionFilePicker {...props} />);
    const pending = wrapper.instance().uploadFile(new File(['zip'], 'solution.zip'));
    const signal = uploadSubmission.mock.calls[0][4];
    wrapper.unmount();
    await pending;
    expect(signal.aborted).toBe(true);
    expect(props.setError).not.toHaveBeenCalledWith('Cancelled');
  });

  test('keeps Topgear URL submissions available without uploading', () => {
    const inputUrl = 'https://wipro365.sharepoint.com/sites/project/deliverable.docx';
    const wrapper = shallow(<SubmissionFilePicker {...props} isChallengeBelongToTopgearGroup />);
    wrapper.setState({ inputUrl });
    wrapper.instance().onClickPick();
    expect(uploadSubmission).not.toHaveBeenCalled();
    expect(props.setUploadData).toHaveBeenCalledWith(expect.objectContaining({
      fileType: 'url', fileUrl: inputUrl, filename: 'deliverable.docx',
    }));
  });
});
