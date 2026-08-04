import { shallow } from 'enzyme';
import React from 'react';

import SubmissionsListView, {
  getDisplayedScores,
  isActiveTestStatus,
  getSubmissionTestProgress,
} from '../../../../../../src/shared/components/challenge-detail/MySubmissions/SubmissionsList';

/**
 * Renders a My Submissions row and returns its visible provisional score.
 * Tests use this to compare score display behavior across scorer processes.
 *
 * @param {String} testProcess Review API test process metadata.
 * @returns {String} provisional score displayed in the submission row.
 * @throws {Error} Propagates errors raised while shallow-rendering SubmissionsListView.
 */
function renderProvisionalScore(testProcess) {
  const wrapper = shallow(
    <SubmissionsListView
      auth={{ tokenV3: 'token' }}
      challenge={{ id: 'challenge-id', metadata: [] }}
      challengesUrl="/challenges"
      hasRegistered
      isLegacyMM={false}
      mySubmissions={[
        {
          createdAt: '2026-08-04T01:05:51.000Z',
          finalScore: 0,
          initialScore: 75.82,
          provisionalScore: 0,
          reviewSummations: [
            {
              metadata: {
                testProcess,
                testProgress: 0.66,
                testStatus: 'IN PROGRESS',
              },
            },
          ],
          status: 'completed',
          submissionId: 'submission-id',
        },
      ]}
      submissionEnded={false}
      submissionsSort={{ field: '', sort: '' }}
      unregistering={false}
    />,
  );
  const scoreColumn = wrapper.find('div')
    .filterWhere((node) => {
      const firstChild = node.children().at(0);
      return firstChild.type() === 'div'
        && firstChild.text() === 'Provisional Score';
    })
    .first();

  return scoreColumn.find('span').last().text();
}

describe('getDisplayedScores', () => {
  test('shows final scores when a system review already produced one before review completes', () => {
    expect(getDisplayedScores(
      {
        finalScore: 100,
        initialScore: 100,
        provisionalScore: 0,
      },
      {
        phases: [
          {
            isOpen: true,
            name: 'Registration',
            scheduledStartDate: '2030-01-01T00:00:00.000Z',
          },
        ],
      },
    )).toEqual({
      finalScore: 100,
      provisionalScore: 100,
    });
  });

  test('shows final scores after the review phase is complete', () => {
    expect(getDisplayedScores(
      {
        finalScore: 100,
        initialScore: 95,
        provisionalScore: 0,
      },
      {
        phases: [
          {
            isOpen: false,
            name: 'Review',
            scheduledStartDate: '2000-01-01T00:00:00.000Z',
          },
        ],
      },
    )).toEqual({
      finalScore: 100,
      provisionalScore: 95,
    });
  });
});

describe('getSubmissionTestProgress', () => {
  it('formats marathon test progress metadata for display', () => {
    expect(getSubmissionTestProgress({
      reviewSummations: [
        {
          metadata: {
            testProcess: 'system',
            testProgress: 0.2,
            testStatus: 'FAILED',
          },
        },
      ],
    })).toEqual({
      process: 'system',
      progressPercent: '20%',
      status: 'FAILED',
    });
  });
});

describe('isActiveTestStatus', () => {
  it('keeps provisional scores hidden while tests are still running', () => {
    expect(isActiveTestStatus('IN PROGRESS')).toBe(true);
    expect(isActiveTestStatus('SUCCESS')).toBe(false);
    expect(isActiveTestStatus('FAILED')).toBe(false);
  });
});

describe('Marathon Match provisional score display', () => {
  it('keeps the completed provisional score visible while system tests are running', () => {
    expect(renderProvisionalScore('system')).toBe('75.82');
  });

  it('keeps the provisional score hidden while provisional tests are running', () => {
    expect(renderProvisionalScore('provisional')).toBe('-');
  });
});
