import * as filestack from 'filestack-js';
import React from 'react';

import FilestackFilePicker from 'components/SubmissionPage/FilestackFilePicker';

jest.mock('filestack-js', () => ({
  init: jest.fn(),
}));
jest.mock('topcoder-react-lib', () => ({
  errors: {
    fireErrorMessage: jest.fn(),
  },
}));
jest.mock('topcoder-react-ui-kit', () => ({
  PrimaryButton: 'button',
}));
jest.mock('topcoder-react-utils', () => ({
  config: {
    FILESTACK: {
      API_KEY: 'test-key',
      REGION: 'test-region',
      SUBMISSION_CONTAINER: 'test-container',
    },
    TOPGEAR_ALLOWED_SUBMISSIONS_DOMAINS: 'wipro365.sharepoint.com',
  },
}));

/**
 * Finds a React element in an unmounted render tree.
 * @param {*} node Candidate React node.
 * @param {Function} predicate Element predicate.
 * @return {Object|null} Matching React element.
 */
function findElement(node, predicate) {
  if (!React.isValidElement(node)) {
    return null;
  }
  if (predicate(node)) {
    return node;
  }
  const children = React.Children.toArray(node.props.children);
  for (let index = 0; index < children.length; index += 1) {
    const match = findElement(children[index], predicate);
    if (match) {
      return match;
    }
  }
  return null;
}

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

  function createComponent(overrides = {}) {
    const component = new FilestackFilePicker({
      ...props,
      ...overrides,
    });
    component.setState = jest.fn((update) => {
      component.state = {
        ...component.state,
        ...update,
      };
    });
    component.componentDidMount();
    return component;
  }

  test('opens standard challenge uploads from the local file system only', () => {
    const component = createComponent();
    const dropZone = findElement(
      component.render(),
      element => element.props['aria-label'] === 'Select file to upload',
    );

    dropZone.props.onClick();

    expect(picker).toHaveBeenCalledTimes(1);
    expect(picker.mock.calls[0][0].fromSources).toEqual(['local_file_system']);
    expect(picker.mock.calls[0][0].accept).toEqual(['.zip']);
    expect(open).toHaveBeenCalledTimes(1);
  });

  test('keeps Topgear URL submissions available', () => {
    const inputUrl = 'https://wipro365.sharepoint.com/sites/project/deliverable.docx';
    const component = createComponent({
      isChallengeBelongToTopgearGroup: true,
    });

    component.state.inputUrl = inputUrl;
    component.onClickPick();

    expect(picker).not.toHaveBeenCalled();
    expect(props.setFilestackData).toHaveBeenCalledWith(expect.objectContaining({
      fileType: 'url',
      fileUrl: inputUrl,
      filename: 'deliverable.docx',
    }));
  });

  test('rejects malformed URLs without evaluating a backtracking expression', () => {
    const component = createComponent();
    const maliciousUrl = `//0.${'00.'.repeat(10000)}`;

    expect(component.isValidUrl(maliciousUrl)).toBe(false);
  });

  test('requires HTTPS and an exact configured Topgear hostname', () => {
    const component = createComponent();

    expect(component.isDomainAllowed('https://wipro365.sharepoint.com/file.zip')).toBe(true);
    expect(component.isDomainAllowed('http://wipro365.sharepoint.com/file.zip')).toBe(false);
    expect(component.isDomainAllowed('https://wipro365.sharepoint.com.attacker.test/file.zip')).toBe(false);
    expect(component.isDomainAllowed('https://user@wipro365.sharepoint.com/file.zip')).toBe(false);
    expect(component.isDomainAllowed('https://wipro365.sharepoint.com:8443/file.zip')).toBe(false);
  });
});
