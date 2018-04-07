import _ from 'lodash';
import { processSRM } from 'utils/tc';

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
});
