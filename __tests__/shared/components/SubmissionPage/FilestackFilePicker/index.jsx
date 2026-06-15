import { shallow } from 'enzyme';
import { client as filestack } from 'filestack-react';
import React from 'react';

import FilestackFilePicker from 'components/SubmissionPage/FilestackFilePicker';

jest.mock('filestack-react', () => ({
  client: {
    init: jest.fn(),
  },
}));

describe('FilestackFilePicker', () => {
  let open;
  let picker;
  let props;

  beforeEach(() => {
    open = jest.fn();
    picker = jest.fn(() => ({ open }));
    filestack.init.mockReturnValue({
      picker,
      upload: jest.fn(),
    });
    props = {
      userId: '123456',
      challengeId: 'challenge-1',
      fileName: '',
      fileExtensions: ['.zip'],
      title: 'Upload submission',
      setError: jest.fn(),
      setFileName: jest.fn(),
      setUploadProgress: jest.fn(),
      dragged: false,
      setDragged: jest.fn(),
      setFilestackData: jest.fn(),
    };
  });

  test('opens standard challenge uploads from the local file system only', () => {
    const wrapper = shallow(<FilestackFilePicker {...props} />);

    wrapper.find('[aria-label="Select file to upload"]').prop('onClick')();

    expect(picker).toHaveBeenCalledTimes(1);
    expect(picker.mock.calls[0][0].fromSources).toEqual(['local_file_system']);
    expect(picker.mock.calls[0][0].accept).toEqual(['.zip']);
    expect(open).toHaveBeenCalledTimes(1);
  });

  test('keeps Topgear URL submissions available', () => {
    const inputUrl = 'https://wipro365.sharepoint.com/sites/project/deliverable.docx';
    const wrapper = shallow((
      <FilestackFilePicker
        {...props}
        isChallengeBelongToTopgearGroup
      />
    ));

    wrapper.setState({ inputUrl });
    wrapper.instance().onClickPick();

    expect(picker).not.toHaveBeenCalled();
    expect(props.setFilestackData).toHaveBeenCalledWith(expect.objectContaining({
      fileType: 'url',
      fileUrl: inputUrl,
      filename: 'deliverable.docx',
    }));
  });
});
