import React from 'react';
import { mount } from 'enzyme';
import SubmissionHistoryModal from 'components/challenge-detail/Submissions/SubmissionHistoryModal';
import DownloadArtifactsModal from 'components/SubmissionManagement/DownloadArtifactsModal';
import { getSubmissionArtifacts } from 'services/submissions';
import { act } from 'react-dom/test-utils';

jest.mock('services/submissions', () => ({ getSubmissionArtifacts: jest.fn() }));

const props = {
  member: 'wleite',
  rating: 2500,
  submissions: [
    {
      submissionId: 'older-id', submissionTime: '2026-06-07T08:20:00Z', provisionalScore: -1, status: 'failed',
    },
    {
      submissionId: 'newer-id', submissionTime: '2026-06-09T09:37:00Z', provisionalScore: 0, finalScore: 0,
    },
  ],
  challengeStatus: 'COMPLETED',
  auth: { tokenV3: 'token' },
  isLoggedIn: true,
  showFinalResults: true,
  onCancel: jest.fn(),
};

describe('MM submission history', () => {
  it('shows IDs, handle, failed status and zero scores, sorted newest first', () => {
    const wrapper = mount(<SubmissionHistoryModal {...props} />);
    expect(wrapper.find('th').map(cell => cell.text())).toEqual([
      'Submission ID', 'Submission Date ', 'Provisional Score', 'Final Score', 'Actions',
    ]);
    expect(wrapper.text()).toContain('Handle: wleite');
    const cells = wrapper.find('tbody tr').first().find('td');
    expect(cells.at(0).text()).toBe('newer-id');
    expect(cells.at(2).text()).toBe('0');
    expect(cells.at(3).text()).toBe('0');
    expect(wrapper.find('tbody tr').last().text()).toContain('Failed');
    wrapper.find('th button').simulate('click');
    expect(wrapper.find('tbody tr').first().find('td').first()
      .text()).toBe('older-id');
    expect(wrapper.find('[aria-sort]').prop('aria-sort')).toBe('ascending');
    wrapper.unmount();
  });

  it('opens artifacts for the selected ID and returns to history without stacking modals', async () => {
    getSubmissionArtifacts.mockResolvedValue({ artifacts: ['example'] });
    const wrapper = mount(<SubmissionHistoryModal {...props} challengeStatus="ACTIVE" />);
    await act(async () => wrapper.find('button[aria-label="View artifacts for older-id"]').simulate('click'));
    wrapper.update();
    expect(wrapper.find(DownloadArtifactsModal).prop('submissionId')).toBe('older-id');
    expect(getSubmissionArtifacts).toHaveBeenCalledWith('token', 'older-id');
    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1);
    wrapper.find('button[aria-label="Close artifacts"]').simulate('click');
    expect(wrapper.find('[aria-label="Submission History"]')).toHaveLength(1);
    expect(document.body.classList.contains('scrolling-disabled-by-modal')).toBe(true);
    wrapper.unmount();
  });

  it('keeps final scores hidden until released and closes via either close control', () => {
    const onCancel = jest.fn();
    const wrapper = mount(
      <SubmissionHistoryModal {...props} showFinalResults={false} onCancel={onCancel} />,
    );
    expect(wrapper.find('tbody tr').first().find('td').at(3)
      .text()).toBe('-');
    wrapper.find('button[aria-label="Close submission history"]').simulate('click');
    wrapper.find('button').filterWhere(b => b.text() === 'Close').simulate('click');
    expect(onCancel).toHaveBeenCalledTimes(2);
    wrapper.unmount();
  });

  it('does not expose artifact actions to anonymous visitors', () => {
    const wrapper = mount(<SubmissionHistoryModal {...props} isLoggedIn={false} />);
    expect(wrapper.find('tbody button')).toHaveLength(0);
    wrapper.unmount();
  });
});
