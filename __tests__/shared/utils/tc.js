import _ from 'lodash';
import { processSRM, challengeLinks } from 'utils/tc';

describe('utils/tc', () => {
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
