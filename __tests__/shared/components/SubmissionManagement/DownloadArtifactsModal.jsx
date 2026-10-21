import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import DownloadArtifactsModal from 'components/SubmissionManagement/DownloadArtifactsModal';

const artifactIds = ['example-internal', 'example', 'provisional-internal', 'system-internal'];

/**
 * Mounts the real artifact modal and waits for its mocked listing request.
 * @param {Object} overrides Props overriding completed MM defaults.
 * @returns {Promise<ReactWrapper>} Mounted, loaded dialog for interaction assertions.
 * @throws {Error} Propagates mounting/test errors.
 */
async function renderModal(overrides = {}) {
  let wrapper;
  await act(async () => {
    wrapper = mount(<DownloadArtifactsModal
      isMM
      challengeStatus="COMPLETED"
      submissionId="submission-id"
      handle="wleite"
      getSubmissionArtifacts={() => Promise.resolve({ artifacts: artifactIds })}
      onDownloadArtifacts={jest.fn()}
      onDownloadAllArtifacts={jest.fn()}
      {...overrides}
    />);
  });
  wrapper.update();
  return wrapper;
}

describe('Submission artifacts modal', () => {
  it('shows only example during competition, even if the API lists internal artifacts', async () => {
    const onDownloadArtifacts = jest.fn();
    const wrapper = await renderModal({ challengeStatus: 'ACTIVE', onDownloadArtifacts });
    expect(wrapper.find('tbody tr')).toHaveLength(1);
    expect(wrapper.find('tbody td').first().text()).toBe('example');
    expect(wrapper.text()).not.toContain('Download all');
    await act(async () => wrapper.find('button[aria-label="Download example"]').simulate('click'));
    expect(onDownloadArtifacts).toHaveBeenCalledWith('submission-id', 'example');
    wrapper.unmount();
  });

  it('offers all authorized artifacts and passes every ID to Download all after completion', async () => {
    const onDownloadAllArtifacts = jest.fn();
    const wrapper = await renderModal({ onDownloadAllArtifacts });
    expect(wrapper.find('tbody tr')).toHaveLength(4);
    expect(wrapper.text()).toContain('Submission ID: submission-id');
    expect(wrapper.text()).toContain('Handle: wleite');
    await act(async () => wrapper.find('button').filterWhere(b => b.text() === 'Download all').simulate('click'));
    expect(onDownloadAllArtifacts).toHaveBeenCalledWith('submission-id', artifactIds);
    wrapper.unmount();
  });

  it('does not release internal artifacts when a challenge is cancelled', async () => {
    const wrapper = await renderModal({ challengeStatus: 'CANCELLED' });
    expect(wrapper.find('tbody tr')).toHaveLength(1);
    expect(wrapper.text()).not.toContain('Download all');
    wrapper.unmount();
  });

  it('preserves the API artifact listing for non-MM submission management', async () => {
    const wrapper = await renderModal({ isMM: false, challengeStatus: 'ACTIVE' });
    expect(wrapper.find('tbody tr')).toHaveLength(4);
    expect(wrapper.text()).not.toContain('Download all');
    wrapper.unmount();
  });

  it('shows loading, empty, and listing failures without offering an empty download', async () => {
    let resolve;
    const wrapper = await renderModal({
      getSubmissionArtifacts: () => new Promise((done) => { resolve = done; }),
    });
    expect(wrapper.find('LoadingIndicator')).toHaveLength(1);
    await act(async () => resolve({ artifacts: [] }));
    wrapper.update();
    expect(wrapper.text()).toContain('No artifacts found');
    expect(wrapper.text()).not.toContain('Download all');
    wrapper.unmount();
    const failed = await renderModal({
      getSubmissionArtifacts: () => Promise.reject(new Error('Forbidden')),
    });
    expect(failed.find('[role="alert"]').text()).toContain('Unable to load artifacts');
    failed.unmount();
  });

  it('keeps the dialog open and shows download errors', async () => {
    const wrapper = await renderModal({
      onDownloadArtifacts: () => Promise.reject(new Error('Forbidden')),
    });
    await act(async () => wrapper.find('button[aria-label="Download example"]').simulate('click'));
    wrapper.update();
    expect(wrapper.find('[role="alert"]').text()).toContain('Unable to download artifacts');
    wrapper.unmount();
  });
});
