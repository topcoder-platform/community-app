import React from 'react';
import _ from 'lodash';
import Renderer from 'react-test-renderer/shallow';
import ChallengeStatus from 'components/challenge-listing/ChallengeCard/Status';
import MockDate from 'mockdate';

beforeAll(() => {
  MockDate.set(1500262917951, 160);
});

afterAll(() => {
  MockDate.reset();
});

const mockDatas = [{
  challenge: {
    technologies: 'Data Science',
    allPhases: [{
      phaseType: 'Registration',
      phaseStatus: 'Open',
    }],
    currentPhases: [{
      phaseType: 'Registration',
      phaseStatus: 'Open',
    }],
    track: 'DEVELOP',
    subTrack: 'CODE',
    events: [{ eventName: 'Submit' }],
    status: 'ACTIVE',
    submissionEndDate: '2019-12-31T23:00:00.000Z',
  },
}, {
  challenge: {
    technologies: 'Data Science',
    allPhases: [{
      phaseType: 'Registration',
      phaseStatus: 'Close',
    }],
    currentPhases: [{
      phaseType: 'Stalled',
      phaseStatus: 'Open',
    }],
    track: 'DEVELOP',
    subTrack: 'CODE',
    events: [{ eventName: 'Submit' }],
    status: 'COMPLETED',
    myChallenge: true,
    submissionEndDate: '2019-12-31T23:00:00.000Z',
  },
}, {
  challenge: {
    technologies: 'Data Science',
    allPhases: [{
      phaseType: 'Registration',
      phaseStatus: 'Close',
    }],
    currentPhases: [{
      phaseType: 'Stalled',
      phaseStatus: 'Open',
    }],
    track: 'DATA_SCIENCE',
    subTrack: 'CODE',
    events: [{ eventName: 'Submit' }],
    status: 'COMPLETED',
    myChallenge: true,
    winners: [{ type: 'final' }, { type: 'final' }, { type: 'final' }, { type: 'final', isLastItem: true }],
    submissionEndDate: '2019-12-31T23:00:00.000Z',
  },
}, {
  challenge: {
    technologies: 'Data Science',
    allPhases: [{
      phaseType: 'Submit',
      phaseStatus: 'DRAFT',
    }],
    track: 'DEVELOP',
    subTrack: 'CODE',
    events: [{ eventName: 'Submit' }],
    status: 'DRAFT',
    myChallenge: true,
    submissionEndDate: '2019-12-31T23:00:00.000Z',
  },
}, {
  challenge: {
    technologies: 'Data Science',
    allPhases: [{
      phaseType: 'Submit',
      phaseStatus: 'DRAFT',
    }],
    track: 'DEVELOP',
    subTrack: 'CODE',
    events: [{ eventName: 'Submit' }],
    status: 'NO-DRAFT',
    myChallenge: true,
    submissionEndDate: '2019-12-31T23:00:00.000Z',
  },
}, {
  challenge: {
    technologies: 'Data Science',
    allPhases: [{
      phaseType: 'Submit',
      phaseStatus: 'Final Fix',
    }],
    currentPhases: [{
      phaseType: 'Submission',
      phaseStatus: 'Close',
    }],
    track: 'DEVELOP',
    subTrack: 'CODE',
    events: [{ eventName: 'Submit' }],
    status: 'ACTIVE',
  },
}];

describe('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  test('shapshot 1', () => {
    _.forEach(mockDatas, (data) => {
      renderer.render((
        <ChallengeStatus {...data} />
      ));
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
