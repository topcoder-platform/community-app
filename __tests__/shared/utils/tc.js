import _ from 'lodash';
import { processActiveDevDesignChallenges, processSRM, challengeLinks } from 'utils/tc';

describe('utils/tc', () => {
  test('processActiveDevDesignChallenges', () => {
    const challenges = [{
      currentPhases: [{
        phaseType: 'Submission',
        scheduledEndTime: 1500350400000,
      }, {
        phaseType: 'NoSubmission',
        scheduledEndTime: 1500350400000,
      }],
      userCurrentPhaseEndTime: 1500350400000,
      userDetails: {
        roles: ['Submitter'],
        hasUserSubmittedForReview: true,
      },
    }, {
      currentPhases: [{
        phaseType: 'Submission',
        scheduledEndTime: 1500350400000,
      }, {
        phaseType: 'NoSubmission',
        scheduledEndTime: 1500350400000,
      }],
      userCurrentPhaseEndTime: 1500350400000,
      userDetails: {
        roles: ['Submitter'],
      },
    }, {
      currentPhases: [{
        phaseType: 'Submission',
        scheduledEndTime: 1500350400000,
      }, {
        phaseType: 'NoSubmission',
        scheduledEndTime: 1500350400000,
      }],
      userCurrentPhaseEndTime: 1500350400000,
      userDetails: {},
      userCurrentPhase: 'Appeals',
    }, {
      currentPhases: [{
        phaseType: 'Submission',
        scheduledEndTime: 1500350400000,
      }, {
        phaseType: 'Submission',
        scheduledEndTime: 1500350400000,
      }],
      userCurrentPhaseEndTime: 1500350400000,
      userDetails: {
        roles: ['NoSubmitter'],
        hasUserSubmittedForReview: false,
      },
    }, {
      currentPhases: [{
        phaseType: 'Submission',
        scheduledEndTime: 1500350400000,
      }],
      userCurrentPhaseEndTime: 1500350400000,
      userDetails: {
        roles: ['NoSubmitter'],
        hasUserSubmittedForReview: false,
      },
    }, {
      currentPhases: [],
      userCurrentPhaseEndTime: 1500350400000,
      userDetails: {
        roles: ['NoSubmitter'],
        hasUserSubmittedForReview: false,
      },
    }];
    processActiveDevDesignChallenges(challenges);
  });

  test('processSRM', () => {
    const srms = [{
      rounds: [{
        userSRMDetails: {
          rated: true,
        },
        codingStartAt: 1500350400000,
        codingEndAt: 1500350400000,
        registrationStartAt: 1500350400000,
        registrationEndAt: 1500350400000,
      }],
    }, {
      rounds: [{}],
    }];
    _.forEach(srms, s => processSRM(s));
  });

  test('challengeLinks', () => {
    const challenges = [{
      subTrack: 'MARATHON_MATCH',
      rounds: [{ id: '1', forumId: '1' }],
    }, {
      subTrack: 'SRM',
      rounds: [{ id: '1', forumId: '1' }],
    }, {
      subTrack: 'OTHER',
      track: 'develop',
    }, {
      subTrack: 'OTHER',
      track: 'data',
    }, {
      subTrack: 'OTHER',
      track: 'design',
    }, {
      subTrack: 'OTHER',
      track: 'nope',
    }];

    _.forEach(challenges, (c) => {
      challengeLinks(c, 'forums');
      challengeLinks(c, 'registrants');
      challengeLinks(c, 'submit');
      challengeLinks(c, 'detail');
      challengeLinks(c, 'submissions');
      challengeLinks(c, 'viewScorecards');
      challengeLinks(c, 'completeAppeals');
      challengeLinks(c, 'unRegister');
      challengeLinks(c, 'default');
    });
  });
});
